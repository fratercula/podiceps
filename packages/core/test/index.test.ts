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
type Apis = Configs<'users' | 'home'>

const middleware = (): Middleware<Res> => ({
  before(config) {
    config.timeout = 5000
  },
  async success(_config, data) {
    data.d.extra = await new Promise((r) => {
      setTimeout(r, 1000, 'success middleware')
    })
  },
})

const configs: Apis = {
  users: {
    path: '/ap',
  },
  home: {
    path: '/a',
  },
}

const podiceps = new Podiceps<Apis, Res>(
  configs,
  {
    baseURL: 'https://randomuser.me',
  },
)

podiceps.use([middleware()])

podiceps.adapter = async (config): Promise<Res> => {
  const { path } = config
  return new Promise((resolve) => setTimeout(resolve, 1000, {
    c: 0,
    d: { path },
    m: '',
  }))
}

const apis = podiceps.create()

describe('podiceps', () => {
  it('default', async () => {
    const res = await apis.users({ path: '/api' })
    expect(res.c).toBe(0)
    expect(res.d.extra).toBe('success middleware')
  })
})
