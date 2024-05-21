import type { Sequelize } from 'sequelize'
import type { TConstant } from '../utils/public'
import { CONSTANT } from '../utils/public'
import { initSite } from './tables/site'
import { initStats } from './tables/stats'
import { initUser } from './tables/user'
import { initMail } from './tables/mail'
import { initRole } from './tables/role'
import { initPermission } from './tables/permission'
import { initUserSite } from './tables/user_site'
import { initUserRole } from './tables/user_role'
import { initRolePermission } from './tables/role_permission'
import type { UserSite } from './tables/user_site'
import type { Site } from './tables/site'
import type { Stats } from './tables/stats'
import type { User } from './tables/user'
import type { Mail } from './tables/mail'
import type { Role } from './tables/role'
import type { Permission } from './tables/permission'
import type { UserRole } from './tables/user_role'
import type { RolePermission } from './tables/role_permission'
import sqlite from './db/sqlite'

export interface TDb {
  sequelize: Sequelize
  Site: typeof Site
  Stats: typeof Stats
  User: typeof User
  Mail: typeof Mail
  Role: typeof Role
  Permission: typeof Permission
  UserSite: typeof UserSite
  UserRole: typeof UserRole
  RolePermission: typeof RolePermission
}

let db: TDb

export default adapter

// Initialize the database
export async function adapter(dbType: TConstant['DB_TYPE'] = CONSTANT.DB_TYPE, force: boolean = false) {
  if (force || !db) {
    let sequelize: Sequelize

    switch (dbType) {
      case 'sqlite':
        sequelize = sqlite.init()
        break
        // case 'mysql':
        // // db = await mysql.init()
        //   break

      default:
        throw new Error('Unknown database type')
    }

    db = await init(sequelize)
  }

  return db
}

export async function init(sequelize: Sequelize): Promise<TDb> {
  // 初始化表
  const Site = initSite(sequelize)
  const Stats = initStats(sequelize)
  const User = initUser(sequelize)
  const Mail = initMail(sequelize)
  const Role = initRole(sequelize)
  const Permission = initPermission(sequelize)
  // const SiteStats = initSiteStats(sequelize)
  const UserSite = initUserSite(sequelize)
  const UserRole = initUserRole(sequelize)
  const RolePermission = initRolePermission(sequelize)

  await sequelize.sync()

  return { sequelize, Site, Stats, User, Mail, Role, Permission, UserSite, UserRole, RolePermission }
}
