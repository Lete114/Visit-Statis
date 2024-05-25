import adapter from './database/adapter.js'
import server from './server.js'
import { hash } from './utils/public.js'

const port = 4000

server({ port })

test(true)
async function test(force?: boolean) {
  const db = await adapter()

  await db.sequelize.sync({ force })

  if (!force) {
    return
  }

  const { Site, User, Role, Permission, UserSite, UserRole, RolePermission } = db

  // 创建权限
  const premissionSystem = await Permission.create({ name: '系统管理', url: '/system' })
  const premissionSite = await Permission.create({ name: '网站管理', url: '/site' })

  // 创建角色
  const roleAdmin = await Role.create({ name: 'admin' })
  const roleBasic = await Role.create({ name: 'basic' })

  // 创建用户
  const lete114 = await User.create({ password: await hash('lete114@gmail.com'), mail: 'lete114@gmail.com' })
  const basic = await User.create({ password: await hash('basic@gmail.com'), mail: 'basic@gmail.com' })

  // 创建网站
  const lete114_site = await Site.create({ domain: 'blog.imlete.cn' })
  const basic_site = await Site.create({ domain: 'basic.cn' })
  const basic_site2 = await Site.create({ domain: 'basic.com' })

  // 角色权限关联
  // 管理员权限
  RolePermission.create({ rid: roleAdmin.id, pid: premissionSystem.id })
  RolePermission.create({ rid: roleAdmin.id, pid: premissionSite.id })
  // 普通用户权限
  RolePermission.create({ rid: roleBasic.id, pid: premissionSite.id })

  // 用户角色关联
  UserRole.create({ uid: lete114.id, rid: roleAdmin.id })
  UserRole.create({ uid: basic.id, rid: roleBasic.id })

  // 用户网站关联
  UserSite.create({ uid: lete114.id, sid: lete114_site.id })
  UserSite.create({ uid: basic.id, sid: basic_site.id })
  UserSite.create({ uid: basic.id, sid: basic_site2.id })
}
