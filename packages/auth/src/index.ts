import Nycticorax from 'nycticorax/dist/core'
import { Middleware } from '@podiceps/core'

type Store = { login: boolean }

const {
  createStore,
  dispatch,
  subscribe,
  getStore,
} = new Nycticorax<Store>()

export default () => {
  createStore({ login: false })

  return <{
    login: () => void,
    logout: () => void,
    middleware: Middleware<any>,
  }>{
    login() {
      dispatch({ login: true }, true)
    },
    logout() {
      dispatch({ login: false }, true)
    },
    middleware: {
      before() {
        return new Promise<void>((resolve) => {
          if (getStore().login) {
            resolve()
            return
          }

          const unSubscribe = subscribe(() => {
            if (getStore().login) {
              unSubscribe()
              resolve()
            }
          })
        })
      },
    },
  }
}
