export interface Config {
  baseURL: string,
  path: string,
  timeout: number,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'HEAD' | 'OPTIONS',
  params: Record<string, string | number | boolean>,
  data: Record<string, any>,
}

export type BeforeMiddleware = (config: Config) => Promise<void>

export type AdapterMiddleware<R> = (config: Config) => Promise<R>

export type SuccessMiddleware<R> = (config: Config, data: R) => Promise<void>

export type ErrorMiddleware = (config: Config, error: Error) => Promise<void>

export type CompleteMiddleware<R> = (
  config: Config,
  data: R | null,
  error: Error | null
) => Promise<void>

export interface MiddlewareConfig<R = {}> {
  before?: BeforeMiddleware,
  success?: SuccessMiddleware<R>,
  error?: ErrorMiddleware,
  complete?: CompleteMiddleware<R>,
}

type GetMiddlewareKeys<T extends string> = `${T}Middlewares`
export type MiddlewareKeys = GetMiddlewareKeys<Partial<keyof MiddlewareConfig>>
