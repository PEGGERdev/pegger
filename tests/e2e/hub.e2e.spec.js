import { expect, test } from '@playwright/test'

const seededRandom = `
  (() => {
    let seed = 1731;
    Math.random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  })();
`

async function openHub(page) {
  await page.addInitScript(seededRandom)
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('region', { name: 'Interactive constellation map' })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(100)
}

async function capture(page, name, { fullPage = true } = {}) {
  await expect(page).toHaveScreenshot(name, {
    animations: 'disabled',
    caret: 'hide',
    fullPage,
    scale: 'css',
  })
}

async function zoomToAllBrightStars(page) {
  await page.getByRole('button', { name: 'Zoom in' }).click()
  await expect(page.locator('button.star[aria-label^="GitHub."]')).toBeVisible()
}

function boxesOverlap(first, second) {
  return first.x < second.x + second.width
    && first.x + first.width > second.x
    && first.y < second.y + second.height
    && first.y + first.height > second.y
}

test.beforeEach(async ({ page }) => {
  await openHub(page)
})

test('captures the complete default landing surface', async ({ page }, testInfo) => {
  await expect(page.getByRole('heading', { name: /Precision-crafted digital products/ })).toBeVisible()

  if (testInfo.project.name === 'mobile') {
    await expect(page.getByRole('heading', { name: 'Explore the work' })).toBeVisible()
    await expect(page.locator('.star-map__mobile-node')).toHaveCount(7)
  } else {
    await expect(page.getByRole('heading', { name: 'Guided constellation' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Choose a featured path into the work.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Patrik Egger' })).toBeVisible()
  }

  await capture(page, 'landing-default.png')
})

test('keeps compact desktop overlays clear and mobile scrolling available', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    const directory = page.getByRole('heading', { name: 'Explore the work' })
    await directory.hover()
    const initialScroll = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 500)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(initialScroll)
    return
  }

  await page.setViewportSize({ width: 1366, height: 768 })
  const heroBox = await page.locator('.hero-panel').boundingBox()
  const guideBox = await page.locator('.star-map__hud--guide').boundingBox()
  const controlsBox = await page.locator('.star-map__hud--controls').boundingBox()

  expect(boxesOverlap(heroBox, guideBox)).toBe(false)
  expect(boxesOverlap(guideBox, controlsBox)).toBe(false)
  await capture(page, 'landing-compact.png', { fullPage: false })
})

test('captures keyboard focus and the expanded constellation', async ({ page }, testInfo) => {
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'View Projects' })).toBeFocused()
  await capture(page, 'landing-keyboard-focus.png')

  if (testInfo.project.name === 'mobile') {
    await capture(page, 'mobile-directory.png')
    return
  }

  await page.getByRole('button', { name: 'Dismiss guide' }).click()
  await zoomToAllBrightStars(page)
  await expect(page.getByText('114%')).toBeVisible()
  await capture(page, 'constellation-expanded.png')

  await page.locator('button.star[aria-label^="GitHub."]').hover()
  await capture(page, 'constellation-hover.png', { fullPage: false })

  await page.mouse.move(1080, 760)
  await page.mouse.down()
  await page.mouse.move(1000, 700, { steps: 5 })
  await page.mouse.up()
  await capture(page, 'constellation-panned.png', { fullPage: false })

  await page.getByRole('button', { name: 'Reset view' }).click()
  await expect(page.getByText('100%')).toBeVisible()
})

test('captures project details, focus, and connected hover states', async ({ page }) => {
  const mobileDirectory = page.locator('.star-map__mobile-node').filter({ hasText: 'Portfolio' })
  const desktopGuide = page.locator('.star-map__guide-action').filter({ hasText: 'Portfolio' })
  const projectEntry = await mobileDirectory.isVisible() ? mobileDirectory : desktopGuide
  await projectEntry.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'My Work' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Portfolio/ })).toHaveAttribute('href', 'https://portfolio.pegger.dev')
  await capture(page, 'panel-apps.png', { fullPage: false })

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  if (await page.getByText('Focused node').isVisible()) {
    await expect(page.getByRole('button', { name: /Open detailed panel/ })).toBeFocused()
    await capture(page, 'focus-portfolio.png', { fullPage: false })

    const typescriptStar = page.locator('button.star[aria-label^="TypeScript."]')
    await typescriptStar.hover()
    await capture(page, 'focus-portfolio-hover.png', { fullPage: false })
  } else {
    await expect(mobileDirectory).toBeFocused()
    await expect(mobileDirectory).toHaveClass(/star-map__mobile-node--selected/)
    await capture(page, 'mobile-portfolio-selected.png')
  }
})

test('captures contact and social panel variants', async ({ page }, testInfo) => {
  const contactButton = page.locator('.hero-panel__action').filter({ hasText: 'Contact' })
  await contactButton.click()
  await expect(page.getByRole('heading', { name: "Let's Connect" })).toBeVisible()
  const contactLink = page.getByRole('link', { name: /patrik\.egger@email\.ch/ })
  await expect(contactLink).toHaveAttribute('href', 'mailto:patrik.egger@email.ch')
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden')

  if (testInfo.project.name === 'mobile') {
    const initialScroll = await page.evaluate(() => window.scrollY)
    await page.locator('.star-panel__backdrop').hover({ position: { x: 8, y: 8 } })
    await page.mouse.wheel(0, 500)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(initialScroll)
  }

  await contactLink.focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Close details panel' })).toBeFocused()
  await capture(page, 'panel-contact.png', { fullPage: false })

  await page.getByRole('button', { name: 'Close details panel' }).click()
  await expect(contactButton).toBeFocused()
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe('')
  const mobileGitHub = page.locator('.star-map__mobile-node').filter({ hasText: 'GitHub' })
  if (await mobileGitHub.isVisible()) {
    await mobileGitHub.click()
  } else {
    await zoomToAllBrightStars(page)
    await page.locator('button.star[aria-label^="GitHub."]').click()
  }
  await expect(page.getByRole('heading', { name: 'Find Me Online' })).toBeVisible()
  await expect(page.getByRole('link', { name: /GitHub/ })).toHaveAttribute('target', '_blank')
  await capture(page, 'panel-socials.png', { fullPage: false })

  await page.locator('.star-panel__backdrop').click({ position: { x: 8, y: 8 } })
  await expect(page.getByRole('dialog')).toBeHidden()
})

test('captures the restricted private panel variant', async ({ page }) => {
  const mobileDevTerminal = page.locator('.star-map__mobile-node').filter({ hasText: 'Dev Terminal' })
  if (await mobileDevTerminal.isVisible()) {
    await mobileDevTerminal.click()
  } else {
    await zoomToAllBrightStars(page)
    await page.locator('button.star[aria-label^="Dev Terminal."]').click()
  }
  await expect(page.getByRole('heading', { name: 'Private Access' })).toBeVisible()
  await expect(page.getByText('Access restricted. Authentication required.')).toBeVisible()
  await expect(page.getByRole('link', { name: /Dev Terminal/ })).toHaveAttribute('href', 'https://dev.pegger.dev')
  await capture(page, 'panel-private.png', { fullPage: false })

  await page.getByRole('button', { name: 'Close details panel' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
})
