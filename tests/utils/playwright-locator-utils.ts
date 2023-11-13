// https://playwright.dev/docs/locators
// https://www.programsbuzz.com/article/playwright-select-first-or-last-element

import { type Page } from '@playwright/test'
import { expect } from '#tests/playwright-utils.ts'

export async function pageLocateTable(page: Page) {
	return await page.getByRole('main').getByRole('table')
}

export async function pageLocateTableHeader(page: Page) {
	const table = await pageLocateTable(page)
	return await table.getByRole('rowgroup').first().getByRole('row')
}

export async function expectPageTableHeaders(
	page: Page,
	columnHeaders: string[],
) {
	const tableHeader = await pageLocateTableHeader(page)
	for (let i = 0; i < columnHeaders.length; i++) {
		const columnHeader = columnHeaders[i]
		await expect(tableHeader.getByRole('cell').nth(i)).toHaveText(columnHeader)
	}
}

export async function pageLocateTableBody(page: Page) {
	const table = await pageLocateTable(page)
	return await table.getByRole('rowgroup').last()
}

export async function pageTableRow(page: Page, row: number = 0) {
	const tableBody = await pageLocateTableBody(page)
	return await tableBody.getByRole('row').nth(row)
}
