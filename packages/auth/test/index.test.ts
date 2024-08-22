import Podiceps, { Configs } from '@podiceps/core'
import auth from '../src'

type Apis = Configs<'default' | 'next' | 'login'>

const configs: Apis = {
  default: {
    path: 'default',
  },
  next: {
    path: 'next',
  },
  login: {
    login: false,
    path: 'login',
  },
}

const podiceps = new Podiceps<Apis, any>(configs)
const {
  login, middleware, isLogin, logout,
} = auth()

podiceps.use([middleware])
podiceps.adaptor = (config) => Promise.resolve(config.path)

const apis = podiceps.create()

let res0: any
let res1: any
let res2: any

describe('podiceps auth', () => {
  it('default', async () => {
    apis.default().then((res: string) => {
      res0 = res
    })
    apis.next().then((res: string) => {
      res1 = res
    })
    apis.login().then((res: string) => {
      res2 = res
    })

    await new Promise((r) => setTimeout(r, 100))

    expect(res0).toBe(undefined)
    expect(res1).toBe(undefined)
    expect(res2).toBe('login')

    login()

    await new Promise((r) => setTimeout(r, 100))

    expect(isLogin()).toBe(true)
    expect(res0).toBe('default')
    expect(res1).toBe('next')

    res0 = undefined
    res1 = undefined

    logout()

    apis.default().then((res: string) => {
      res0 = res
    })

    await new Promise((r) => setTimeout(r, 100))
    expect(res0).toBe(undefined)

    login()

    await new Promise((r) => setTimeout(r, 100))
    expect(res0).toBe('default')

    apis.next().then((res: string) => {
      res1 = res
    })
    await new Promise((r) => setTimeout(r, 100))
    expect(res1).toBe('next')
  })
})
