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
  async success(config, data) {
    data.d.extra = await new Promise((r) => {
      setTimeout(r, 1000, 'success middleware')
    })
  },
})

const configs: Apis = {
  users: {
    path: '/api',
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

const apis = podiceps.create()

console.log(apis)

describe('podiceps', () => {
  it('default', () => {
    expect(1).toBe(1)
  })
})
