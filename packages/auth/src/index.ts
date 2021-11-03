import Nycticorax from 'nycticorax/dist/core'
import { Middleware } from '@podiceps/core'

type Store = { login?: boolean }

const {
  createStore,
  dispatch,
  subscribe,
  getStore,
} = new Nycticorax<Store>()

export default () => {
  createStore({ login: undefined })

  return <{
    login: () => void,
    logout: () => void,
    middleware: Middleware<any>,
  }>{
    login() {
      dispatch({ login: true })
    },
    logout() {
      dispatch({ login: false })
    },
    middleware: {
      before() {
        return new Promise<void>((resolve) => {
          if (getStore().login) {
            resolve()
            return
          }

          if (getStore().login === false) {
            return
          }

          subscribe(() => {
            if (getStore().login) {
              resolve()
            }
          })
        })
      },
    },
  }
}
