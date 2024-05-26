export function is_mail(mail: string) {
  const mailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return mailRegex.test(mail)
}

export function get_uuid() {
  if (crypto && crypto.randomUUID) { return crypto.randomUUID() }
  return URL.createObjectURL(new Blob(['1'])).split('/').pop()!
}

export function is_url(str: string) {
  try {
    const { hostname } = new URL(str)
    // eslint-disable-next-line regexp/no-unused-capturing-group
    const urlRegex = /([A-Z\d]{1,30}\.)+[A-Z\d]{2,5}$/i

    return urlRegex.test(hostname)
  }
  catch (error) {
    return false
  }
}
