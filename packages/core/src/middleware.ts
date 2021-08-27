import {
  BeforeMiddleware,
  AdapterMiddleware,
  SuccessMiddleware,
  ErrorMiddleware,
  CompleteMiddleware,
  MiddlewareConfig,
  MiddlewareKeys,
} from './types'

class Middleware<R> {
  protected beforeMiddlewares: BeforeMiddleware[]

  protected adapterMiddleware: AdapterMiddleware<R>

  protected successMiddlewares: SuccessMiddleware<R>[]

  protected errorMiddlewares: ErrorMiddleware[]

  protected completeMiddlewares: CompleteMiddleware<R>[]

  constructor() {
    this.beforeMiddlewares = []
    this.adapterMiddleware = () => Promise.resolve(undefined as any)
    this.successMiddlewares = []
    this.errorMiddlewares = []
    this.completeMiddlewares = []
  }

  use(middlewares: MiddlewareConfig<R>[]): void {
    middlewares.forEach((middleware) => {
      Object.keys(middleware).forEach((type) => {
        const currentType = `${type}Middlewares` as MiddlewareKeys
        const currentMiddle = middleware[type as 'before']

        if (this[currentType]) {
          this[currentType].push(currentMiddle as BeforeMiddleware)
        }
      })
    })
  }

  set adapter(middleware: AdapterMiddleware<R>) {
    this.adapterMiddleware = middleware
  }
}

export default Middleware
