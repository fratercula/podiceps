import { Config } from '@podiceps/core'

const fetchAdaptor = <T, >(config: Config): Promise<T> => {
  const {
    params,
    path,
    method,
    baseURL,
    data,
    headers,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeout,
    ...rest
  } = config

  let nextPath = path
  if (params) {
    nextPath += `?${Object.keys(params)
      .filter((k) => params![k] !== undefined)
      .map((k) => `${k}=${params![k]}`)
      .join('&')}`
  }

  return new Promise((resolve, reject) => {
    window.fetch((baseURL || '') + nextPath, {
      method,
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers,
      ...rest,
    })
      .then((response) => response.json())
      .then((res) => resolve(res as T))
      .catch((e) => reject(e))
  })
}

export default fetchAdaptor
