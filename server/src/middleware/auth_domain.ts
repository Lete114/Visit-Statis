import type { NextFunction, Request, Response } from '@tinyhttp/app'
import micromatch from 'micromatch'
import { CONSTANT } from '../utils/public'
import { adapter } from '../database/adapter'
import type { IAuthDomainOptions } from '../global'

export function auth_domain(options: IAuthDomainOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isMatch = micromatch.isMatch(req.url, options.intercept_list || [])
      // 如果请求的路由在白名单中，则跳过身份验证
      if (!isMatch) { return next() }
      const referer = req.headers.referer
      // eslint-disable-next-line no-console
      console.log('referer: ', referer)

      if (!referer) { return res.status(401).json({ msg: 'Not found referer' }) }

      const { hostname: domain } = new URL(referer)
      // eslint-disable-next-line no-console
      console.log('domain', domain)

      const db = await adapter(CONSTANT.DB_TYPE)
      // await db.Site.create({
      //   domain,
      // })
      const site = await db.Site.findOne({
        where: {
          domain,
        },
      })

      if (site) {
        return next()
      }
      else {
        res.status(401).json({ msg: 'Unauthorized domain' })
      }
    }
    catch (error) {
    // token 验证失败则返回 403 错误
      return res.status(403).json({ msg: 'Forbidden' })
    }
  }
};
