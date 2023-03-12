export type Config = {
  baseURL?: string,
  path?: string,
  timeout?: number,
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS',
  params?: Record<string, string>,
  data?: Record<string, any> | FormData,
  headers?: Record<string, string>,
  [key: string]: any,
}

export type Configs<K extends string> = Record<K, Config>

export type GlobalConfig = Pick<Config, 'baseURL' | 'timeout' | 'headers'> & {
  [key: string]: any,
}

export type BeforeMiddleware = (config: Config) => Promise<void> | void

export type Handler<R> = (config: Config) => Promise<R>

export type SuccessMiddleware<R> = (config: Config, data: R) => Promise<void> | void

export type ErrorMiddleware = (config: Config, error: Error) => Promise<void> | void

export type CompleteMiddleware<R> = (
  config: Config,
  data?: R,
  error?: Error,
) => Promise<void> | void

export interface MiddlewareConfig<R = {}> {
  before?: BeforeMiddleware,
  success?: SuccessMiddleware<R>,
  error?: ErrorMiddleware,
  complete?: CompleteMiddleware<R>,
}

type GetMiddlewareKeys<T extends string> = `${T}Middlewares`
export type MiddlewareKeys = GetMiddlewareKeys<Partial<keyof MiddlewareConfig>>
