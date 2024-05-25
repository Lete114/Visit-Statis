export const key = 'permission'
export function getPermission() {
  const permission_string = localStorage.getItem(key)
  if (!permission_string) {
    return null
  }
  const permission = JSON.parse(permission_string) as { name: string, url: `/${string}` }[]
  return permission
}
export function setPermission(value: any) {
  const permission_string = JSON.stringify(value)
  localStorage.setItem(key, permission_string)
}
