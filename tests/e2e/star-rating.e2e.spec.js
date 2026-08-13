import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixtures/star-rating.html')
})

test('previews and selects half-star values from pointer position', async ({ page }) => {
  const rating = page.getByRole('slider', { name: 'Product rating' })
  const fourthStar = rating.locator('[data-star="4"]')
  const box = await fourthStar.boundingBox()

  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2)
  await expect(fourthStar.locator('.star-rating__fill')).toHaveAttribute('style', /width: 50%/)
  await expect(page.getByTestId('rating-value')).toHaveText('2.5')

  await page.mouse.move(0, 0)
  await expect(fourthStar.locator('.star-rating__fill')).toHaveAttribute('style', /width: 0%/)

  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2)
  await expect(page.getByTestId('rating-value')).toHaveText('3.5')
  await expect(rating).toHaveAttribute('aria-valuenow', '3.5')
  await expect(rating).toHaveAttribute('aria-valuetext', '3.5 out of 5 stars')
})

test('supports keyboard selection and boundary commands', async ({ page }) => {
  const rating = page.getByRole('slider', { name: 'Product rating' })

  await rating.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('rating-value')).toHaveText('3')
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByTestId('rating-value')).toHaveText('2.5')
  await page.keyboard.press('End')
  await expect(page.getByTestId('rating-value')).toHaveText('5')
  await page.keyboard.press('Home')
  await expect(page.getByTestId('rating-value')).toHaveText('0')
})

test('renders precise fractions and protects disabled and read-only values', async ({ page }) => {
  const disabled = page.getByRole('slider', { name: 'Disabled rating' })
  const readonly = page.getByRole('slider', { name: 'Read only rating' })

  await expect(disabled).toHaveAttribute('aria-disabled', 'true')
  await expect(disabled).toHaveAttribute('tabindex', '-1')
  await disabled.locator('[data-star="5"]').click()
  await expect(page.getByTestId('disabled-value')).toHaveText('2')

  await expect(readonly).toHaveAttribute('aria-readonly', 'true')
  await expect(readonly.locator('[data-star="4"] .star-rating__fill')).toHaveAttribute('style', /width: 70%/)
  await readonly.focus()
  await page.keyboard.press('ArrowRight')
  await readonly.locator('[data-star="5"]').click()
  await expect(page.getByTestId('readonly-value')).toHaveText('3.7')
})
