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

	// Always display the SignalTable alongside the appropriate board
	return (
		<div className='flex flex-col h-screen'>
			{/* SignalTable at the top */}
			<div className='mb-4'>
				<SignalTable />
			</div>

			{/* Main content below - either AdminBoard or UserBoard */}
			<div className='flex-1 border-t border-gray-200 dark:border-gray-700 pt-4'>
				{isAdmin === undefined ? (
					<div className='w-full h-full flex items-center justify-center'>
						<p className='text-xl'>Загрузка...</p>
					</div>
				) : isAdmin ? (
					<AdminBoardPage />
				) : (
					<UserBoardPage />
				)}
			</div>
		</div>
	)
}
