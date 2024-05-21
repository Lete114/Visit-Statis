const key = 'token'
export function getToken() {
  const token = localStorage.getItem(key)
  return token
}
export function setToken(value: string) {
  localStorage.setItem(key, value)
}
