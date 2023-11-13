import { type DataFunctionArgs, json } from '@remix-run/node'
import { useLoaderData, type MetaFunction } from '@remix-run/react'
import {
	Content,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '#app/components/index.ts'
import { requireAdminUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { formatDate } from '#app/utils/misc.tsx'

export async function loader({ request }: DataFunctionArgs) {
	await requireAdminUserId(request)
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			roles: { select: { name: true } },
			createdAt: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})
	return json({ users })
}

export default function AdminUsersRoute() {
	const data = useLoaderData<typeof loader>()
	const { users } = data
	return (
		<Content variant="index">
			<p className="text-body-md">Admin Users</p>
			<Table>
				<TableCaption>All existing users</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Username</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Joined</TableHead>
						<TableHead className="text-right">Roles</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map(user => (
						<TableRow key={user.id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.name}</TableCell>
							<TableCell>{formatDate(new Date(user.createdAt))}</TableCell>
							<TableCell className="text-right">
								{user.roles.map(role => role.name).join(', ')}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Content>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: `Admin | Users` },
		{
			name: 'description',
			content: `Admin page for users for Epic Notes`,
		},
	]
}
