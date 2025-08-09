'use client'

import { useEffect } from 'react'

import { SignalTable } from '@/components/signal-table/SignalTable'

import { useAuth } from '@/hooks/useAuth'

import AdminBoardPage from './(admin-board)/AdminBoardPage'
import styles from './IPage.module.scss'
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

	return (
		<div className={styles.contentWrapper}>
			<div className={styles.signalTableBlock}>
				<SignalTable />
			</div>

			<div className={styles.mainContent}>
				{isAdmin === undefined ? (
					<div className={styles.loadingWrap}>
						<p className={styles.loadingText}>Загрузка...</p>
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
