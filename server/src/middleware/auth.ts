import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from '@tinyhttp/app'
import micromatch from 'micromatch'
import { CONSTANT } from '../utils/public'
import type { IAuthOptions } from '../global'
import { getUser } from '../database/utils'
import adapter from '../database/adapter'

export function auth(options: IAuthOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isMatch = micromatch.isMatch(req.path, options.white_list || [])
    // 如果请求的路由在白名单中，则跳过身份验证
    if (isMatch) { return next() }

    const token = req.headers.authorization

    // 如果 token 不存在，则返回 401 错误
    if (!token) { return res.status(401).json({ msg: 'Unauthorized' }) }

    try {
    // 验证 token
      const { id } = jwt.verify(token, CONSTANT.SECRET) as { id: string }

      const db = await adapter(CONSTANT.DB_TYPE)
      const user = await db.User.findOne({ where: { id } })

      if (!user) { return res.status(401).json({ msg: 'Unauthorized' }) }

      req.user = await getUser(user)
      next()
    }
    catch (error) {
    // token 验证失败则返回 403 错误
      return res.status(403).json({ msg: 'Forbidden' })
    }
  }
};
