# Podiceps adaptor fetch

fetch

```bash
$ npm i @podiceps/fetch -S
```

## Usage

```ts
import fetchAdaptor from '@podiceps/fetch'

type R = { c: string }

podiceps.adaptor = (config) => fetchAdaptor<R>(config)
```
