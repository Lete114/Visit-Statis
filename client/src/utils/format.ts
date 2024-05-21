import tinydateformat2 from 'tinydateformat2'

export const date = {
  YYYYMMDD(date?: string | number | Date) {
    return tinydateformat2('YYYY-MM-DD', date)
  },
  YYYYMMDDHHmmss(date?: string | number | Date) {
    return tinydateformat2('YYYY-MM-DD HH:mm:ss', date)
  },
}

export function formatNumberWithCommas(number: number, locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale)
  return formatter.format(number)
}
