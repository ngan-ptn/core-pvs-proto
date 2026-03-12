import { test, expect } from '@playwright/test'

test('page loads with heading', async ({ page }) => {
  await page.goto('/')
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
})
