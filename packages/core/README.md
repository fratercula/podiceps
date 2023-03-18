# Podiceps

A middleware design library for request

## Install

```bash
$ npm i @podiceps/core -S
```

## Usage

```ts
import Podiceps, { Configs, Middleware } from '@podiceps/core'

type Response = {
  c: number,
  m: string,
  d: Record<string, any>,
}
type Apis = Configs<'user' | 'posts'>

const middlewares: Middleware<Response> = {
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
}
const apis: Apis = {
  user: {
    path: '/user',
  },
  posts: {
    method: 'POST',
  },
}

const podiceps = new Podiceps<Apis, Response>(
  apis,
  {
    baseURL: 'http://a.url',
  },
)
podiceps.use([middlewares])
podiceps.adaptor = async (config): Promise<Response> => {
  const { path } = config
  return new Promise((resolve) => setTimeout(resolve, 1000, {
    c: 0,
    d: { path },
    m: '',
  }))
}
const ctx = podiceps.create()
```

## API

### context

create context width configs and response type

```ts
new Podiceps<Configs, Response>(configs)
```

### middlewares

```ts
// before
type before = (config: Config) => Promise<void> | void

// success
type success = (config: Config, data: Response) => Promise<void> | void

// error
type error = (config: Config, error: Error) => Promise<void> | void

// complete
type complete = (config: Config, data?: Response, error?: Error) => Promise<void> | void
```

### use

use middlewares

```ts
type use = (middlewares: Middleware[]) => void
```

### adaptor

set adaptor for request

```ts
set adaptor(adaptor: Adaptor<Response>)
```

### create

get the context

```ts
type create = () => void
```

## Flow

```
before -> adaptor -> success -> complete
                  -> error -> complete
```
