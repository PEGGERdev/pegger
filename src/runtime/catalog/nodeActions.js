export function projectNodeAction(node) {
  const data = node?.data
  if (!data || typeof data !== 'object') return null

  if (data.url !== undefined && data.url !== null) {
    if (typeof data.url !== 'string' || !/^https:\/\//i.test(data.url) || /[\\\s\u0000-\u001f\u007f]/.test(data.url)) return null
    try {
      const url = new URL(data.url)
      if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null
      return {
        href: url.href,
        label: 'Visit site',
        accessibleLabel: `Open ${node.label || 'site'}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        icon: 'bi-box-arrow-up-right',
      }
    } catch {
      return null
    }
  }

  const email = data.email
  if (typeof email !== 'string'
    || !/^[A-Za-z0-9._+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email)
    || email.startsWith('.') || email.includes('..') || email.includes('.@')) return null

  return {
    href: `mailto:${email}`,
    label: 'Send email',
    accessibleLabel: `Email ${email}`,
    target: null,
    rel: null,
    icon: 'bi-envelope',
  }
}
