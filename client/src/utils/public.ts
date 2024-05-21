export function is_mail(mail: string) {
  const mailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return mailRegex.test(mail)
}