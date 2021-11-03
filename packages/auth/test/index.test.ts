import Podiceps, { Configs } from '@podiceps/core'
import auth from '../src'

type Apis = Configs<'default' | 'next'>

const configs: Apis = {
  default: {
    path: 'default',
  },
  next: {
    path: 'next',
  },
}

const podiceps = new Podiceps<Apis, any>(configs)
const { login, logout, middleware } = auth()

podiceps.use([middleware])
podiceps.fetcher = (config) => Promise.resolve(config.path)

const apis = podiceps.create()

let res0: string
let res1: string

describe('podiceps auth', () => {
  it('default', async () => {
    apis.default().then((res: string) => {
      res0 = res
    })
    apis.next().then((res: string) => {
      res1 = res
    })

    await new Promise((r) => setTimeout(r, 100))

    expect(res0).toBe(undefined)
    expect(res1).toBe(undefined)

    login()

    await new Promise((r) => setTimeout(r, 100))

    expect(res0).toBe('default')
    expect(res1).toBe('next')

    logout()
  })
})
