/* eslint-disable no-param-reassign */
import Podiceps, {
  Configs,
  Middleware,
} from '../src'

type Res = {
  c: number,
  m: string,
  d: Record<string, any>,
}
type Apis = Configs<'default' | 'error'>

const middleware = (): Middleware<Res> => ({
  before(config) {
    config.timeout = 5000
  },
  async success(_config, data) {
    data.d.success = await new Promise((r) => {
      setTimeout(r, 1000, 'success')
    })
  },
  complete(_config, data) {
    if (data) {
      data.d.complete = 'complete'
    }
  },
})

const errorMiddleware = (): Middleware<Res> => ({
  error(_config, error) {
    error.message = 'error'
  },
  // @ts-ignore
  notExistType(data) {
    if (data) {
      data.d.extra = 'complete'
    }
  },
})

const configs: Apis = {
  default: {
    path: '/ap',
  },
  error: {
    path: '/a',
  },
}

const podiceps = new Podiceps<Apis, Res>(
  configs,
  {
    baseURL: 'https://randomuser.me',
  },
)
const podiceps1 = new Podiceps<Apis, Res>(configs)
const podiceps2 = new Podiceps<Configs<'apiName'>, any>({ apiName: {} })

podiceps.use([middleware()])
podiceps1.use([errorMiddleware(), middleware()])

podiceps.adaptor = async (config): Promise<Res> => {
  const { path } = config
  return new Promise((resolve) => setTimeout(resolve, 1000, {
    c: 0,
    d: { path },
    m: '',
  }))
}
podiceps1.adaptor = (): Promise<Res> => new Promise((resolve) => setTimeout(resolve, 10000, {
  c: 0,
  d: {},
  m: '',
}))

const apis = podiceps.create()
const apis1 = podiceps1.create()
const apis2 = podiceps2.create()

describe('podiceps', () => {
  it('default', async () => {
    const res = await apis.default<Res>({ path: '/api' })
    expect(res.c).toBe(0)
    expect(res.d.success).toBe('success')
    expect(res.d.complete).toBe('complete')
  })

  it('error', async () => {
    await expect(apis1.error({
      timeout: 1000,
    })).rejects.toThrow('error')
  })

  it('fetcher', async () => {
    const res = await apis2.apiName()
    expect(res).toBe(undefined)
  })
})
