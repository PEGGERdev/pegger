import { expect, test } from '@playwright/test'

async function selectNode(page, label) {
  const mobile = page.locator('.star-map__mobile')
  if (await mobile.isVisible()) {
    await page.locator('.star-map__mobile-node').filter({ hasText: label }).click()
    return
  }

  const node = page.locator(`button.star[aria-label^="${label}."]`)
  if (!(await node.isVisible())) await page.getByRole('button', { name: 'Zoom in' }).click()
  await node.click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('region', { name: 'Interactive constellation map' })).toBeVisible()
})

test('opens a project through a semantic safe link, not through selection', async ({ page, context }) => {
  let requests = 0
  await context.route('https://portfolio.pegger.dev/**', async route => {
    requests++
    await route.fulfill({ contentType: 'text/html', body: '<h1>Controlled portfolio</h1>' })
  })
  await selectNode(page, 'Portfolio')
  expect(requests).toBe(0)
  const link = page.getByRole('link', { name: 'Open Portfolio', exact: true })
  await expect(link).toHaveAttribute('href', 'https://portfolio.pegger.dev/')
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  const opened = context.waitForEvent('page')
  await link.click()
  const target = await opened
  await expect(target.getByRole('heading', { name: 'Controlled portfolio' })).toBeVisible()
  expect(requests).toBe(1)
  expect(await target.evaluate(() => window.opener === null)).toBe(true)
  await target.close()
})

test('exposes a working email intent for the contact node', async ({ page }) => {
  await selectNode(page, 'Contact')
  const link = page.getByRole('link', { name: 'Email patrik.egger@email.ch', exact: true })
  await expect(link).toHaveAttribute('href', 'mailto:patrik.egger@email.ch')
  await expect(link).not.toHaveAttribute('target', '_blank')
  await link.evaluate(element => element.addEventListener('click', event => {
    event.preventDefault()
    element.dataset.activated = 'true'
  }))
  await link.click()
  await expect(link).toHaveAttribute('data-activated', 'true')
})

test('keeps the protected destination behind its own authentication', async ({ page, context }) => {
  let requests = 0
  await context.route('https://dev.pegger.dev/**', async route => {
    requests++
    expect(new URL(route.request().url()).search).toBe('')
    await route.fulfill({ status: 401, contentType: 'text/html', body: '<h1>Private authentication required</h1>' })
  })
  await selectNode(page, 'Dev Terminal')
  expect(requests).toBe(0)
  const link = page.getByRole('link', { name: 'Open Dev Terminal', exact: true })
  await expect(link).toHaveAttribute('href', 'https://dev.pegger.dev/')
  const opened = context.waitForEvent('page')
  await link.click()
  const target = await opened
  await expect(target.getByRole('heading', { name: 'Private authentication required' })).toBeVisible()
  expect(requests).toBe(1)
  await target.close()
})

test('matches CSS and rendering at the exact 900px breakpoint', async ({ page }) => {
  for (const width of [899, 900, 901]) {
    await page.setViewportSize({ width, height: 1000 })
    if (width <= 900) {
      await expect(page.getByRole('heading', { name: 'Explore the work' })).toBeVisible()
    } else {
      await expect(page.getByRole('heading', { name: 'Guided constellation' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible()
      expect((await page.locator('.star-map').boundingBox()).height).toBeGreaterThan(500)
    }
  }
})

test('supports mobile detail keyboard dismissal without overflow or lost focus', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 })
  const node = page.locator('.star-map__mobile-node').filter({ hasText: 'Portfolio' })
  await node.focus()
  await page.keyboard.press('Enter')
  await expect(node).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('link', { name: 'Open Portfolio', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  const close = page.getByRole('button', { name: 'Close details for Portfolio', exact: true })
  await close.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('link', { name: 'Open Portfolio', exact: true })).toHaveCount(0)
  await expect(node).toHaveAttribute('aria-expanded', 'false')
  await expect(node).toBeFocused()
})
