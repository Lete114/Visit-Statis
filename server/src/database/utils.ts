import { CONSTANT } from '../utils/public'
import { adapter } from './adapter'
import type { User } from './tables/user'

const db = await adapter(CONSTANT.DB_TYPE)

export async function getUser(user: User) {
  const user_roles = await db.UserRole.findAll({ where: { uid: user.id } })

  // 获取所有角色的 id
  const roleIds = user_roles.map(user_role => user_role.rid)

  // 获取所有角色
  const roles = await db.Role.findAll({ where: { id: roleIds } })

  // 获取所有角色对应的权限
  const rolePermissions = await db.RolePermission.findAll({ where: { rid: roleIds } })

  // 获取所有权限的 id
  const permissionIds = rolePermissions.map(rolePermission => rolePermission.pid)

  // 获取所有权限
  const permissions = await db.Permission.findAll({ where: { id: permissionIds } })

  const data = {
    ...user,
    role: roles.map(i => i.name),
    permission: permissions.map(i => i.name),
    roles,
    permissions,
  }

  return data
}
