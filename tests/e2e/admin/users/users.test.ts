import { formatDate } from '#app/utils/misc.tsx'
import { test } from '#tests/playwright-utils.ts'
import { expectPageTableHeaders } from '#tests/utils/playwright-locator-utils.ts'
import { expectLoginUrl, expectUrl } from '#tests/utils/url-utils.ts'
import {
	expectAdminUsersContent,
	expectAdminUsersPage,
	expectAdminUsersTableRowContent,
	goToAdminUsersPage,
} from './users-utils.ts'

test.describe('User cannot view Admin users page', () => {
	test('when not logged in', async ({ page }) => {
		await goToAdminUsersPage(page)
		await expectLoginUrl({ page, redirectTo: '/admin/users' })
	})

	test('when logged in as user', async ({ page, login }) => {
		await login()
		await goToAdminUsersPage(page)
		await expectUrl({ page, url: '/' })
	})
})

test.describe('User can view Admin users', () => {
	test('when logged in as admin', async ({ page, login }) => {
		const user = await login({ roles: ['user', 'admin'] })

		await goToAdminUsersPage(page)
		await expectAdminUsersPage(page)

		await expectAdminUsersContent(page)

		await expectPageTableHeaders(page, ['Username', 'Name', 'Joined', 'Roles'])

		const name = user.name ?? '' // name is optional
		const joinedDate = formatDate(new Date(user.createdAt))
		const roles = user.roles.map(role => role.name).join(', ')
		const rowContent = [user.username, name, joinedDate, roles]

		await expectAdminUsersTableRowContent(page, 0, rowContent)
	})
})
