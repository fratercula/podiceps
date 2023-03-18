/**
 * @jest-environment jsdom
 */

import Podiceps, { Configs } from '@podiceps/core'
import fetchAdaptor from '../src'

type Apis = Configs<'get' | 'post'>

const configs: Apis = {
  get: {
    path: '/get',
  },
  post: {
    method: 'POST',
  },
}

type R = { c: string }

const podiceps = new Podiceps<Apis, R>(configs)

podiceps.adaptor = (config) => fetchAdaptor<R>(config)

const apis = podiceps.create()

const unmockedFetch = global.fetch

describe('adaptor fetch', () => {
  beforeAll(() => {
    // @ts-ignore
    global.fetch = (url, init) => {
      if (init?.body instanceof FormData) {
        return Promise.resolve({
          json: () => Promise.resolve({
            c: 'FormData',
          }),
        })
      }
      if (url === '/a') {
        return Promise.reject(new Error('error'))
      }
      return Promise.resolve({
        json: () => Promise.resolve({
          c: url,
        }),
      })
    }
  })

  afterAll(() => {
    global.fetch = unmockedFetch
  })

  it('get', async () => {
    const res = await apis.get()
    expect(res.c).toBe('/get')

    const next = await apis.get({ params: { a: '1', b: '2' } })
    expect(next.c).toBe('/get?a=1&b=2')
  })

  it('post', async () => {
    await expect(apis.post({
      path: '/a',
    })).rejects.toThrow('error')

    const res = await apis.post({ data: new FormData() })
    expect(res.c).toBe('FormData')
  })
})
