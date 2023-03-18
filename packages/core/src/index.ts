import Middleware from './middleware'
import { Config, GlobalConfig } from './types'

export {
  Configs, MiddlewareConfig as Middleware, Adaptor, Config,
} from './types'

class Podiceps<C extends Record<string, Config>, R> extends Middleware<R> {
  private configs: C

  private globalConfig?: GlobalConfig

  private contexts: Record<keyof C, (config?: Config) => Promise<R>>

  constructor(configs: C, globalConfig?: GlobalConfig) {
    super()
    this.configs = configs
    this.globalConfig = globalConfig || {}
    this.contexts = {} as Record<keyof C, (config?: Config) => Promise<R>>
    this.init()
  }

  private init() {
    const keys: (keyof C)[] = Object.keys(this.configs)

    keys.forEach((key) => {
      const config = {
        ...this.globalConfig,
        ...this.configs[key],
      }

      this.contexts[key] = (extraConfig) => {
        const currentConfig = {
          ...config,
          ...extraConfig,
        }
        return this.controler(currentConfig)
      }
    })
  }

  private async controler(config: GlobalConfig & Config): Promise<R> {
    const timeoutSymbol = Symbol('timeout')
    const timeout = config.timeout || 10000

    let data: unknown
    let error: unknown

    try {
      await this.exec({ type: 'beforeMiddlewares', config })

      data = await Promise.race([
        this.adaptorMiddleware(config),
        new Promise((r) => setTimeout(r, timeout, timeoutSymbol)),
      ])

      if (data as symbol === timeoutSymbol) {
        data = undefined
        throw new Error(`timeout of ${timeout} ms exceeded`)
      }

      await this.exec({ type: 'successMiddlewares', config, data: data as R })
    } catch (e) {
      error = e
      await this.exec({
        type: 'errorMiddlewares',
        config,
        error: error as Error,
      })
    } finally {
      await this.exec({
        type: 'completeMiddlewares',
        config,
        data: data as R,
        error: error as Error,
      })
    }

    if (error) {
      throw error
    }

    return data as R
  }

  public create() {
    return this.contexts
  }
}

export default Podiceps
