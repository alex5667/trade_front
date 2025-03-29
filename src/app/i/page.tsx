'use client'

import { useAuth } from '@/hooks/useAuth'

import AdminBoardPage from './(admin-board)/AdminBoardPage'
import UserBoardPage from './UserBoardPage'

export default function IPage() {
	const { user } = useAuth()
	const isAdmin = user?.roles?.includes('admin')

	if (isAdmin === undefined) {
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				Loading...
			</div>
		)
	}

	return isAdmin ? <AdminBoardPage /> : <UserBoardPage />
}
