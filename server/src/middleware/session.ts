import type { NextFunction, Request, Response } from '@tinyhttp/app'
import nextSession from 'next-session'

const getSession = nextSession({ })

export function session() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // @ts-expect-error  使用next-session中间件
    await getSession(req, res)
    next()
  }
};
