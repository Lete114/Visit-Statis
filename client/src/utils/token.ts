import workerTick from 'worker-tick'
import { key as permission_key } from './permission'
import { storage_get, storage_remove, storage_set } from './storage'

const key = 'token'
export function getToken() {
  const token = storage_get(key)
  return token
}
export function setToken(value: string) {
  storage_set(key, value)
}

const ids: string[] = []

// 过期自动删除 token (提前一分钟删除)
function expiration_time(token: string | null) {
  ids.forEach(id => workerTick.clearTimeout(id))
  ids.length = 0

  if (token) {
    const [,data] = token.split('.')
    const info = JSON.parse(atob(data))
    // 使用到期时间减去当前时间得到剩余时间，单位是秒，然后设置定时器删除
    const expirationTimeSec = info.exp - Math.floor(Date.now() / 1000)
    // 将秒转换为毫秒
    const expirationTimeMs = expirationTimeSec * 1000
    // 删除1分钟
    const advanceOneMinExpirationTimeMs = expirationTimeMs - (1000 * 60)

    // 提前一分钟删除
    const id = workerTick.setTimeout(() => {
      storage_remove(key)
      storage_remove(permission_key)
    }, advanceOneMinExpirationTimeMs)

    ids.push(id)
  }
}

expiration_time(getToken())
