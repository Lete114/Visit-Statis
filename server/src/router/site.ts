import { App } from '@tinyhttp/app'
import { json } from 'milliparsec'
import type { Site } from '../database/tables/site'
import { PERMISSION } from '../utils/public'
import { SITE_VALID_ENUM } from '../global'

export const site_router = new App()

site_router.get('/', (_req, res) => {
  res.json({ msg: 'Not found user' })
})

site_router.get('/list', async (req, res) => {
  const query = req.query as { page_num: string, page_size: string }
  const page_num = +query.page_num || 1
  const page_size = +query.page_size || 10

  const list: Site[] = []

  if (req.user.role.includes(PERMISSION.admin)) {
    const sites = await req.db.Site.findAll({
      limit: page_size,
      offset: (page_num - 1) * page_size,
    })
    list.push(...sites)
  }
  else {
    const user_site = await req.db.UserSite.findAll({ where: { uid: req.user.id } })
    const user_site_ids = user_site.map(i => i.sid)
    const where = { id: user_site_ids }
    const sites = await req.db.Site.findAll({
      where,
      limit: page_size,
      offset: (page_num - 1) * page_size,
    })
    list.push(...sites)
  }

  res.json({ msg: 'get site list success', list: list.map(item => ({ ...item, valid: !!item.valid })) })
})

site_router.post('/add', json(), async (req, res) => {
  try {
    const { url } = req.body as { uuid: string, url: string }
    const { host: domain } = new URL(url)

    let uuid = ''
    const site = await req.db.Site.findOne({ where: { domain } })
    if (site) {
      uuid = site.id
    }
    else {
      const { id } = await req.db.Site.create({ domain })
      uuid = id
    }

    res.send({ msg: 'add site success', uuid })
  }
  catch (error) {
    console.error('add site error:', error)
    res.status(500).send({ msg: 'add site error' })
  }
})

site_router.post('/verify', json(), async (req, res) => {
  try {
    const { url } = req.body as { url: string }
    const { host } = new URL(url)
    const site = await req.db.Site.findOne({ where: { domain: host } })
    if (!site) {
      res.status(400).send({ msg: 'add verify error' })
      return
    }

    const text = await fetch(url).then(r => r.text())

    // 使用正则表达式提取 meta 标签
    const metaRegex = /<meta\s+name="visit-stat-site-verify"\s+content="([0-9a-f-]{36})"\s*\/?>/i
    const match = text.match(metaRegex)

    if (match && site.id === match[1]) {
      const where = { id: site.id, domain: host }
      const data = { valid: SITE_VALID_ENUM.Valid }
      await req.db.Site.update(data, { where })
      await req.db.UserSite.create({ uid: req.user.id, sid: site.id })
      res.send({ msg: 'add verify success' })
    }
    else {
      res.status(400).send({ msg: 'meta tag not found or invalid' })
    }
  }
  catch (error) {
    console.error('add verify error:', error)
    res.status(500).send({ msg: 'add verify error' })
  }
})
