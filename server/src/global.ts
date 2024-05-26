import type { Permission } from './database/tables/permission'
import type { Role } from './database/tables/role'
import type { TDb } from './database/adapter'

export type TWhite_list = `/${string}`

export interface IAuthOptions {
  white_list?: TWhite_list[]
}

export interface IAuthDomainOptions extends IAuthOptions {
  intercept_list?: TWhite_list[]
}

// 扩展 Request 类型以包含 user 属性
declare module '@tinyhttp/app' {
  interface Request {
    db: TDb
    session: {
      mail?: string
      captcha?: string
    }
    user: {
      id: string
      mail: string
      password: string
      create_time: string
      update_time: string
      role: string[]
      permission: {
        name: string
        url: string
      }[]
      roles: Role[]
      permissions: Permission[]
    }
  }
}

export const SITE_VALID_ENUM = {
  Invalid: 0,
  Valid: 1,
} as const
