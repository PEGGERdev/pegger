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
    await expect(page.locator('.star-map__mobile-cluster')).toHaveCount(5)
  } else {
    await expect(page.getByRole('heading', { name: 'Guided constellation' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Choose a featured path into the work.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Patrik Egger' })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Patrik Egger\./ })).toBeVisible()
    await expect(page.locator('.cluster-region')).toHaveCount(5)
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
  await expect.poll(async () => {
    const centerInfoBox = await page.locator('.center-presence__info').boundingBox()
    const settledGuideBox = await page.locator('.star-map__hud--guide').boundingBox()
    return boxesOverlap(centerInfoBox, settledGuideBox)
  }).toBe(false)
  await capture(page, 'landing-compact.png', { fullPage: false })
})

test('captures keyboard focus and the expanded constellation', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    await capture(page, 'mobile-directory.png')
    return
  }

  await page.keyboard.press('Tab')
  await expect(page.getByRole('region', { name: 'Interactive constellation map' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Dismiss guide' })).toBeFocused()
  await capture(page, 'landing-keyboard-focus.png')

  await page.getByRole('button', { name: 'Dismiss guide' }).click()
  await zoomToAllBrightStars(page)
  await expect(page.getByText('114%')).toBeVisible()
  await expect(page.locator('.cluster-region:not(.cluster-region--dormant)')).toHaveCount(5)
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

test('captures zoom focus, star detail, and connected hover states', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    const mobilePortfolio = page.locator('.star-map__mobile-node').filter({ hasText: 'Portfolio' })
    await mobilePortfolio.click()
    await expect(mobilePortfolio).toHaveClass(/star-map__mobile-node--selected/)
    await expect(mobilePortfolio).toHaveAttribute('aria-pressed', 'true')
    await capture(page, 'mobile-portfolio-selected.png')
    return
  }

  const guidePortfolio = page.locator('.star-map__guide-action').filter({ hasText: 'Portfolio' })
  await guidePortfolio.click()
  await expect(page.getByText('Focused node')).toBeVisible()
  await expect(page.getByText('Portfolio').first()).toBeVisible()
  await expect(page.locator('button.star[aria-label^="Portfolio."]')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.cluster-region[data-cluster-id="product-craft"]')).toHaveClass(/cluster-region--active/)
  await capture(page, 'focus-portfolio.png', { fullPage: false })

  const typescriptStar = page.locator('button.star[aria-label^="TypeScript."]')
  await typescriptStar.hover()
  await capture(page, 'focus-portfolio-hover.png', { fullPage: false })
})

test('captures contact zoom and social star focus', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    const mobileContact = page.locator('.star-map__mobile-node').filter({ hasText: 'Contact' })
    if (await mobileContact.isVisible()) {
      await mobileContact.click()
      await expect(mobileContact).toHaveAttribute('aria-pressed', 'true')
    }
    await capture(page, 'mobile-contact-selected.png')
    return
  }

  await zoomToAllBrightStars(page)
  await page.locator('button.star[aria-label^="Contact."]').click()
  await expect(page.getByText('Focused node')).toBeVisible()
  await expect(page.getByText('Contact').first()).toBeVisible()
  await page.waitForTimeout(1400)
  await capture(page, 'focus-contact.png', { fullPage: false })

  await page.locator('.star-map__control--wide').click()
  await page.waitForTimeout(1400)
  await zoomToAllBrightStars(page)
  await page.locator('button.star[aria-label^="GitHub."]').click()
  await expect(page.getByText('GitHub').first()).toBeVisible()
  await page.waitForTimeout(1400)
  await capture(page, 'focus-github.png', { fullPage: false })
})

test('captures dev terminal zoom and focus state', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'mobile') {
    const mobileDev = page.locator('.star-map__mobile-node').filter({ hasText: 'Dev Terminal' })
    await mobileDev.click()
    await expect(mobileDev).toHaveAttribute('aria-pressed', 'true')
    await capture(page, 'mobile-dev-selected.png')
    return
  }

  await zoomToAllBrightStars(page)
  await page.locator('button.star[aria-label^="Dev Terminal."]').click()
  await expect(page.getByText('Focused node')).toBeVisible()
  await expect(page.getByText('Dev Terminal').first()).toBeVisible()
  await page.waitForTimeout(1400)
  await capture(page, 'focus-dev-terminal.png', { fullPage: false })
})
