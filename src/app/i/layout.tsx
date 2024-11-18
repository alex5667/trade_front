import type { PropsWithChildren } from 'react'

import { Header } from '@/components/dashboard-layout/header/Header'
import Sidebar from '@/components/dashboard-layout/sidebar/Sidebar'

import styles from './AdminBoard.module.scss'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className={styles.dashBoardWrapper}>
			<Sidebar />
			<div className='w-full flex flex-col ml-[60px]'>
				<Header />
				<main className={styles.main}>{children}</main>
			</div>
		</div>
	)
}
