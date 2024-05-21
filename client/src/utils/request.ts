import { ElMessage } from 'element-plus'
import { getToken, setToken } from './token'

const METHODS = ['GET', 'POST']

export interface IOptions extends RequestInit {
  method: 'GET' | 'POST'
  params?: Record<string, any>
}

export async function request(url: RequestInfo | URL, options: Partial<IOptions> = {}) {
  if (!options.method) {
    options.method = 'GET'
  }

  if (typeof url === 'string') {
    url = url.startsWith('/') ? url : `/${url}`
    url = `/api${url}`
  }

  const headers = new Headers(options.headers)

  // 检查是否存在 token，如果存在则设置 Authorization 请求头
  const token = getToken()
  if (token) {
    headers.set('Authorization', token)
  }

  const requestOptions = {
    ...options,
    headers,
  }

  try {
    if (METHODS.includes(options.method.toUpperCase())) {
      if (options.method.toUpperCase() === 'GET' && options.params) {
        const params = new URLSearchParams(options.params)
        url = `${url}?${params.toString()}`
      }
      else if (options.method.toUpperCase() === 'POST' && options.params) {
        requestOptions.body = JSON.stringify(options.params)
        headers.set('content-type', 'application/json;charset=utf-8')
      }
    }
    else {
      throw new Error('Illegal request method !')
    }
    const response = await fetch(url, requestOptions)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        ElMessage({ message: '未登录或登录已过期，请重新登录', type: 'error' })
        setToken('')
        return
      }

      ElMessage({ message: data.msg, type: 'error' })
      throw new Error(`Request failed with status ${response.status}`)
    }
    return data
  }
  catch (error: any) {
    console.error('Error:', error)
    ElMessage({ message: error.message, type: 'error' })
    throw error
  }
}
