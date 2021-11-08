# Podiceps auth middleware

wait for login before request

```bash
$ npm i @podiceps/auth -S
```

## Usage

```ts
import auth from '@podiceps/auth'

const { login, logout, middleware } = auth()

podiceps.use([middleware])

login() // after login, start request

logout() // logout
```
