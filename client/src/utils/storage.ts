// local
export function storage_get(key: string) {
  return localStorage.getItem(key)
}
export function storage_set(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function storage_remove(key: string) {
  localStorage.removeItem(key)
}

export function storage_key(index: number) {
  return localStorage.key(index)
}

export function storage_clear() {
  localStorage.clear()
}

export function storage_length() {
  return localStorage.length
}

export function storage_keys() {
  const keys = Object.keys(localStorage)
  return keys
}

export function storage_values() {
  const keys = storage_keys()
  return keys.map(key => storage_get(key))
}

export function storage_getAll() {
  const keys = storage_keys()
  const all:Record<string, string> = {}

  keys.forEach((key) => {
    Reflect.set(all, key, localStorage.getItem(key))
  })

  return all
}

// session
export function session_get(key: string) {
  return sessionStorage.getItem(key)
}
export function session_set(key: string, value: string) {
  sessionStorage.setItem(key, value)
}

export function session_remove(key: string) {
  sessionStorage.removeItem(key)
}

export function session_key(index: number) {
  return sessionStorage.key(index)
}

export function session_clear() {
  sessionStorage.clear()
}

export function session_length() {
  return sessionStorage.length
}

export function session_keys() {
  const keys = Object.keys(sessionStorage)
  return keys
}

export function session_values() {
  const keys = session_keys()
  return keys.map(key => session_get(key))
}

export function session_getAll() {
  const keys = session_keys()
  const all:Record<string, string> = {}

  keys.forEach((key) => {
    Reflect.set(all, key, sessionStorage.getItem(key))
  })

  return all
}