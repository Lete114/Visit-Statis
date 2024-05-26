import { storage_get, storage_set } from "./storage"

export const key = 'permission'
export function getPermission() {
  const permission_string = storage_get(key)
  if (!permission_string) {
    return null
  }
  const permission = JSON.parse(permission_string) as { name: string, url: `/${string}` }[]
  return permission
}
export function setPermission(value: any) {
  const permission_string = JSON.stringify(value)
  storage_set(key, permission_string)
}
