import axios from 'axios'
import type  { AxiosRequestConfig, AxiosResponse } from 'axios'
// import { requestCode } from '../enums/index'
// create an axios instance
const baseURL = 'http://localhost:8080'
const service = axios.create({
  baseURL,
  timeout: 1000 * 60 * 5,
})

interface RequestConfig extends AxiosRequestConfig {
  showToast?: boolean
}

class ReqClock {
  reqList: string[]
  constructor() {
    this.reqList = []
  }

  generateReqCode(config: RequestConfig): string {
    return (
      config.url +
      '_' +
      config.method +
      '_' +
      (config.data ? JSON.stringify(config.data) : '')
    )
  }

  addReq(config: RequestConfig) {
    if (!this.hasReq(config)) {
      this.reqList.push(this.generateReqCode(config))
    }
  }

  hasReq(config: RequestConfig): boolean {
    return this.reqList.includes(this.generateReqCode(config))
  }

  removeReq(config: RequestConfig) {
    const index = this.reqList.indexOf(this.generateReqCode(config))
    if (index > -1) {
      this.reqList.splice(index, 1)
    }
  }
}

export interface Response<T> {
  code: string
  data: T
  msg: string
}

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.dir(error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  result => {
    return result
  },
  error => {
    return Promise.reject(error)
  },
)

const reqClock = new ReqClock()

export default <T>(config: RequestConfig) => {
  return new Promise<Response<T>>((resolve, reject) => {
    reqClock.addReq(config)
    service
      .request<Response<T>>(config)
      .then((result: AxiosResponse<Response<T>>) => {
        resolve(result.data)
      })
      .catch(reject)
      .finally(() => {
        reqClock.removeReq(config)
      })
  })
}
