import { App } from '@tinyhttp/app'
import jwt from 'jsonwebtoken'
import { json } from 'milliparsec'
import type { ConfigObject } from 'svg-captcha'
import svgCaptcha from 'svg-captcha'
import { CONSTANT, compare, generate_random_number, hash, is_mail } from '../utils/public'
import { getUser } from '../database/utils'
import { send } from '../utils/mail'
import { user_router } from './user'
import { site_router } from './site'
import { stats_router } from './stats'

export const root_router = new App()

root_router.use('/user', user_router)
root_router.use('/site', site_router)
root_router.use('/stats', stats_router)

root_router.all('/', (_req, res) => {
  res.json({ msg: 'Not found' })
})

root_router.get('/captcha', async (req, res) => {
  const options: ConfigObject = {
    noise: 5,
    color: true,
    background: '#fff',
  }
  const captcha = svgCaptcha.create(options)
  // const captcha = svgCaptcha.createMathExpr(options);
  req.session.captcha = captcha.text.toUpperCase()
  res.send({ svg: captcha.data })
})

root_router.post('/send_mail', json(), async (req, res) => {
  const { mail } = req.body

  if (!is_mail(mail)) {
    res.status(400).send({ msg: 'Mailbox format error' })
  }

  const code = generate_random_number(6)

  req.session.mail = mail

  try {
    await send(mail, code)
    res.send({ msg: 'Success to send mail' })
  }
  catch (error) {
    const msg = 'Failed to send mail'
    // eslint-disable-next-line no-console
    console.log(`${msg}:`, error)
    res.status(400).send({ msg })
  }
})

root_router.post('/login', json(), async (req, res) => {
  const { mail, password, captcha } = req.body

  const session_captcha = req.session?.captcha

  // 是否有验证码
  const is_captcha = session_captcha && captcha
  // 验证码是否匹配
  const match_captcha = session_captcha === captcha?.toUpperCase()

  if (!is_captcha || !match_captcha) {
    res.status(401).json({ msg: 'Invalid captcha' })
    return
  }

  // 参数不合法
  if (!mail || !password) {
    res.status(400).send({ msg: 'Bad Request' })
    return
  }

  // 检查用户名和密码是否匹配
  const where = { mail }
  const user = await req.db.User.findOne({ where })
  if (!user) {
    res.status(401).json({ msg: 'Invalid credentials' })
    return
  }
  // 检查密码是否匹配
  const is_match = await compare(password, user.password)
  if (!is_match) {
    res.status(401).json({ msg: 'Invalid credentials' })
    return
  }

  const users = await getUser(user)

  // 创建 JWT token
  const token = jwt.sign({ id: user.id }, CONSTANT.SECRET, { expiresIn: '1h' })
  res.json({ msg: 'login success', mail, role: users.role, permission: users.permission, token })
})

root_router.post('/register', json(), async (req, res) => {
  if (!req.session.mail) {
    res.status(403).send({ msg: 'Please get the email verification code first' })
    return
  }

  const { mail, code, password } = req.body

  // 参数不合法
  if (!mail || !code || !password) {
    res.status(400).send({ msg: 'Bad Request' })
    return
  }

  if (!is_mail(mail)) {
    res.status(400).send({ msg: 'Mailbox format error' })
    return
  }

  if (mail !== req.session.mail) {
    res.status(400).send({ msg: 'Mailbox not match' })
    return
  }

  // 检查用户名已存在
  const where = { mail }
  const is_user = await req.db.User.findOne({ where })
  if (is_user) {
    res.status(401).json({ msg: 'The user already exists' })
    return
  }

  const hash_passowd = await hash(password)
  const user = await req.db.User.create({ mail, password: hash_passowd })
  const role = (await req.db.Role.findOne({ where: { name: 'basic' } }))!

  req.db.UserRole.create({ uid: user.id, rid: role.id })

  const users = await getUser(user)

  // 创建 JWT token
  const token = jwt.sign({ id: user.id }, CONSTANT.SECRET, { expiresIn: '1h' })
  res.json({ msg: 'register success', mail, role: users.role, permission: users.permission, token })
})
