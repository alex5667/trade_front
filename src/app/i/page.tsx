'use client'

import { useEffect } from 'react'

import { SignalTable } from '@/components/signal-table/SignalTable'

import { useAuth } from '@/hooks/useAuth'

import AdminBoardPage from './(admin-board)/AdminBoardPage'
import UserBoardPage from './UserBoardPage'

export default function IPage() {
	const { user } = useAuth()
	const isAdmin = user?.roles?.includes('admin')

	useEffect(() => {
		console.log(
			'IPage rendered, auth status:',
			isAdmin === undefined ? 'loading' : isAdmin ? 'admin' : 'user'
		)
	}, [isAdmin])

	if (isAdmin === undefined) {
		console.log('Rendering SignalTable (auth loading state)')
		return (
			<div className='w-full h-screen flex items-center justify-center'>
				<SignalTable />
			</div>
		)
	}

	console.log('Auth determined, rendering appropriate board')
	return isAdmin ? <AdminBoardPage /> : <UserBoardPage />
}
