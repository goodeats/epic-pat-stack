import { type Page } from '@playwright/test'
import { expect } from '#tests/playwright-utils.ts'
import { goTo } from '#tests/utils/page-utils.ts'
import { pageTableRow } from '#tests/utils/playwright-locator-utils.ts'
import { expectUrl } from '#tests/utils/url-utils.ts'

export async function goToAdminUsersPage(page: Page) {
	await goTo(page, '/admin/users')
}

export async function expectAdminUsersPage(page: Page) {
	await expectUrl({ page, url: '/admin/users' })
}

export async function expectAdminUsersContent(page: Page) {
	await expect(page.getByRole('main').getByText('Admin Users')).toBeVisible()
	await expect(page.getByText('All existing users')).toBeVisible()
}

export async function expectAdminUsersTableRowContent(
	page: Page,
	row: number,
	rowContent: string[],
) {
	const tableBodyRow = await pageTableRow(page, row)
	for (let i = 0; i < rowContent.length; i++) {
		const content = rowContent[i]
		await expect(tableBodyRow.getByRole('cell').nth(i)).toHaveText(content)
	}
}
