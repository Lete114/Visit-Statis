import type { IncomingMessage } from 'node:http'
import os from 'node:os'
import process from 'node:process'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import picocolors from 'picocolors'
import getUserIP from 'get-user-ip'

export const colors = picocolors

const { IP_HEADERS } = process.env

export interface TConstant {
  DB_TYPE: 'sqlite' // | 'mysql'
  SECRET: string
}

export const CONSTANT: TConstant = {
  DB_TYPE: 'sqlite',
  SECRET: '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
}

export function get_user_ip(req: IncomingMessage) {
  const headers = IP_HEADERS?.split(',')
  return getUserIP(req, headers)
}

export function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex')
}

export function hash(str: string, salt_Length = 10) {
  return bcrypt.hash(str, salt_Length)
}

export function compare(str: string, hash: string) {
  return bcrypt.compare(str, hash)
}

export const isUrlRegExp = /^https?:\/\//

/**
 * @param { string } url
 * @returns url
 */
export function urlHandler(url: string) {
  return url
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/(\/index\.html|\/)*$/gi, '')
}
/**
 * @param { string } url
 * @returns url
 */
export function refererHandler(url: string) {
  return urlHandler(url)
    .replace(isUrlRegExp, '')
}

export function generate_random_number(length: number) {
  // Use the '**' operator instead of 'Math.pow'.
  const min = 10 ** (length - 1)
  const max = 10 ** length - 1
  return Math.floor(min + Math.random() * (max - min + 1))
}

export function is_mail(mail: string) {
  const mailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return mailRegex.test(mail)
}

interface IOptionsResolveServerUrls {
  https?: string
  port?: number
  base?: string
}
export function resolveServerUrls(options: IOptionsResolveServerUrls = {}) {
  const protocol = options.https ? 'https' : 'http'
  const port = options.port || 3000
  const base = options.base || '/'

  const local: string[] = []
  const network: string[] = []

  const networkInterfaces = Object.values(os.networkInterfaces()).flatMap(nInterface => nInterface ?? [])

  // @ts-expect-error get IPV4
  const IPv4 = networkInterfaces.filter(detail => detail?.address && (detail.family === 'IPv4' || detail.family === 4))

  IPv4.forEach((detail) => {
    let host = detail.address.replace('127.0.0.1', 'localhost')
    // ipv6 host
    if (host.includes(':')) {
      host = `[${host}]`
    }
    const url = `${protocol}://${host}:${port}${base}`
    if (detail.address.includes('127.0.0.1')) {
      local.push(url)
    }
    else {
      network.push(url)
    }
  })
  return { local, network }
}

export function printServerUrls(urls: { local: string[], network: string[] }) {
  const colorUrl = url =>
    colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`))
  for (const url of urls.local) {
    // eslint-disable-next-line no-console
    console.log(`  ${colors.green('➜')}  ${colors.bold('Local')}:   ${colorUrl(url)}`)
  }
  for (const url of urls.network) {
    // eslint-disable-next-line no-console
    console.log(`  ${colors.green('➜')}  ${colors.bold('Network')}: ${colorUrl(url)}`)
  }
}
