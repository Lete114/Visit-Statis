import 'dotenv/config'
import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { LogLevel, logger } from '@tinyhttp/logger'
import { root_router } from './router/root.js'
import { auth } from './middleware/auth.js'
import { auth_domain } from './middleware/auth_domain.js'
import type { IAuthDomainOptions, IAuthOptions } from './global.js'
import { getDB } from './middleware/getDB.js'
import { session } from './middleware/session.js'
import adapter from './database/adapter.js'
import { colors, printServerUrls, resolveServerUrls } from './utils/public.js'

export const connect_database = adapter

export interface IOptions {
  port: number
  auth_options?: IAuthOptions
}

function server(options: IOptions) {
  const port = options.port

  const app = new App({
    onError: (err, _req, res) => {
      // eslint-disable-next-line no-console
      console.log(err)
      res.status(500).send(`Something bad happened`)
    },
    noMatchHandler: (_req, res) => {
      res.status(404).send('Not found :(')
    },
  })

  const logger_options = {
    methods: ['GET', 'POST'],
    timestamp: { format: 'HH:mm:ss' },
    // eslint-disable-next-line no-console
    output: { callback: console.log, color: false, level: LogLevel.warn },
  }

  const auth_domain_options: IAuthDomainOptions = {
    intercept_list: [
      '/stats',
    ],
  }
  const auth_options: IAuthOptions = {
    white_list: [
      '/',
      '/user',
      '/stats',
      '/captcha',
      '/send_mail',
      '/login',
      '/register',
    ],
  }

  if (options.auth_options) {
    if (options.auth_options.white_list && auth_options.white_list) {
      auth_options.white_list.push(...options.auth_options.white_list)
    }
  }

  app
    .use(session())
    .use(getDB())
    .use(cors())
    .use(logger(logger_options))
    .use(auth_domain(auth_domain_options))
    .use(auth(auth_options))

  app.use('/', root_router)

  app.listen(port, () => {
    const urls = resolveServerUrls({ port })
    // eslint-disable-next-line no-console
    console.log(`${colors.green('[Server]')} Server is running at:`)
    printServerUrls(urls)
  })

  return root_router
}

export { server }
export default server
