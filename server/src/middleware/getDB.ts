import type { NextFunction, Request, Response } from '@tinyhttp/app'
import adapter from '../database/adapter'
import { CONSTANT } from '../utils/public'

export function getDB() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const db = await adapter(CONSTANT.DB_TYPE)
    req.db = db
    next()
  }
}
