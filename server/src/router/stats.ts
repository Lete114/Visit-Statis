import { App } from '@tinyhttp/app'
import adapter from '../database/adapter.js'
import { CONSTANT, PERMISSION, get_user_ip, urlHandler } from '../utils/public.js'
import type { Stats } from '../database/tables/stats.js'

export const stats_router = new App()

interface IVisitStatsOptions {
  id?: string
  ip: string
  domain: string
}

function getIP(total_visitors: string) {
  const total_visitors_array = total_visitors.split(',')
  return total_visitors_array.length
}
function setIP(total_visitors: string, ip: string) {
  const total_visitors_array = total_visitors.split(',')
  const set = new Set<string>(total_visitors_array)
  set.add(ip)

  const toArray = Array.from(set).filter(Boolean)
  const toString = toArray.join(',')
  return toString
}

async function visit_stats(options: IVisitStatsOptions) {
  const db = await adapter(CONSTANT.DB_TYPE)
  const { id, ip, domain } = options

  const site = (await db.Site.findOne({ where: { domain } }))!

  const where = { id, sid: site.id }

  const [stats] = await db.Stats.findOrCreate({
    where,
    defaults: where,
  })

  const updateValue = { total_visits: stats.total_visits + 1, total_visitors: setIP(stats.total_visitors, ip) }
  await db.Stats.update(updateValue, { where })

  const dataValue = (await db.Stats.findOne({ where }))!

  return {
    total_visits: dataValue.total_visits,
    total_visitors: getIP(dataValue.total_visitors),
  }
}

stats_router.get('/', async (req, res) => {
  const ip = get_user_ip(req)
  const referer = urlHandler(req.headers.referer!)
  const { hostname: domain, pathname: id } = new URL(referer)

  const options = { id, ip, domain }

  const data: {
    root_total_visitors?: number
    root_total_visits?: number
    total_visitors?: number
    total_visits?: number
  } = {}

  const visit = await visit_stats({ ...options, id: '/' })
  data.root_total_visitors = visit.total_visitors
  data.root_total_visits = visit.total_visits

  // 当id不为网站根时，则表明这是二级以上的路径
  if (id !== '/') {
    const visit = await visit_stats(options)
    data.total_visitors = visit.total_visitors
    data.total_visits = visit.total_visits
  }

  res.json(data)
})

stats_router.get('/list', async (req, res) => {
  const query = req.query as { domain: string, pageNum: string, pageSize: string }
  const domain = query.domain
  const pageNum = +query.pageNum || 1
  const pageSize = +query.pageSize || 10

  let total = 0
  const stats_list: Stats[] = []

  const site = await req.db.Site.findOne({ where: { domain } })
  if (!site) {
    res.status(403).send({ msg: '域名不存在' })
    return
  }

  if (!req.user.role.includes(PERMISSION.admin)) {
    const user_site = await req.db.UserSite.findAll({ where: { uid: req.user.id } })
    const user_site_ids = user_site.map(i => i.sid)
    if (!user_site_ids.includes(site.id)) {
      res.status(403).send({ msg: '无权访问该域名' })
      return
    }
  }

  const where = { sid: site.id }
  total = await req.db.Stats.count({ where })
  const stats = await req.db.Stats.findAll({
    where,
    limit: pageSize,
    offset: (pageNum - 1) * pageSize,
  })
  stats_list.push(...stats)

  const list = stats_list.map((i) => {
    return {
      ...i,
      total_visitors: getIP(i.total_visitors),
    }
  })

  res.send({ msg: 'get stats list success', total, list })
})
