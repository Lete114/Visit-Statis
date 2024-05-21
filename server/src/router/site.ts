import { App } from '@tinyhttp/app'
import type { Site } from '../database/tables/site'

export const site_router = new App()

site_router.get('/', (_req, res) => {
  res.json({ msg: 'Not found user' })
})

site_router.get('/list', async (req, res) => {
  const query = req.query as { pageNum: string, pageSize: string }
  const pageNum = +query.pageNum || 1
  const pageSize = +query.pageSize || 10

  let total = 0
  const list: Site[] = []

  if (req.user.permission.includes('/system')) {
    total = await req.db.Site.count()
    const sites = await req.db.Site.findAll({
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
    })
    list.push(...sites)
  }
  else {
    const user_site = await req.db.UserSite.findAll({ where: { uid: req.user.id } })
    const user_site_ids = user_site.map(i => i.sid)
    const where = { id: user_site_ids }
    total = await req.db.Site.count({ where })
    const sites = await req.db.Site.findAll({
      where,
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
    })
    list.push(...sites)
  }

  res.json({ msg: 'Not found site list', total, list })
})
