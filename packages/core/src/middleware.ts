import {
  BeforeMiddleware,
  Handler,
  SuccessMiddleware,
  ErrorMiddleware,
  CompleteMiddleware,
  MiddlewareConfig,
  MiddlewareKeys,
  Config,
  GlobalConfig,
} from './types'

class Middleware<R> {
  protected beforeMiddlewares: BeforeMiddleware[]

  protected handlerMiddleware: Handler<R>

  protected successMiddlewares: SuccessMiddleware<R>[]

  protected errorMiddlewares: ErrorMiddleware[]

  protected completeMiddlewares: CompleteMiddleware<R>[]

  constructor() {
    this.beforeMiddlewares = []
    this.handlerMiddleware = () => Promise.resolve(undefined as any)
    this.successMiddlewares = []
    this.errorMiddlewares = []
    this.completeMiddlewares = []
  }

  use(middlewares: MiddlewareConfig<R>[]): void {
    middlewares.forEach((middleware) => {
      Object.keys(middleware).forEach((type) => {
        const currentType = `${type}Middlewares` as MiddlewareKeys
        const currentMiddle = middleware[type as 'before']
        const currentMiddlewares = this[currentType] as BeforeMiddleware[]

        if (currentMiddlewares) {
          currentMiddlewares.push(currentMiddle as BeforeMiddleware)
        }
      })
    })
  }

  /** Deprecated */
  set fetcher(middleware: Handler<R>) {
    this.handlerMiddleware = middleware
  }

  set handler(middleware: Handler<R>) {
    this.handlerMiddleware = middleware
  }

  protected async exec({
    type,
    config,
    data,
    error,
  }: {
    type: MiddlewareKeys,
    config: Config & GlobalConfig,
    data?: R,
    error?: Error,
  }) {
    const middlewares = this[type]
    for (let i = 0; i < middlewares.length; i += 1) {
      if (type === 'beforeMiddlewares') {
        await (middlewares[i] as BeforeMiddleware)(config)
      }
      if (type === 'successMiddlewares') {
        await (middlewares[i] as SuccessMiddleware<R>)(config, data as R)
      }
      if (type === 'errorMiddlewares') {
        await (middlewares[i] as ErrorMiddleware)(config, error as Error)
      }
      if (type === 'completeMiddlewares') {
        await (middlewares[i] as CompleteMiddleware<R>)(config, data, error)
      }
    }
  }
}

export default Middleware
