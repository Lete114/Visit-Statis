import { App } from '@tinyhttp/app'

export const user_router = new App()

user_router.get('/', (_req, res) => {
  res.json({ msg: 'Not found user' })
})
