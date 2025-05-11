import type { PropsWithChildren } from 'react'

import { Header } from '@/components/dashboard-layout/header/Header'
import Sidebar from '@/components/dashboard-layout/sidebar/Sidebar'
import { SignalSocketInitializer } from '@/components/signal-table/SignalSocketInitializer'

import styles from './IPage.module.scss'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className={styles.dashBoardWrapper}>
			<SignalSocketInitializer />

			<Sidebar />
			<div className='w-full flex flex-col md:ml-[50px]'>
				<Header />
				<main className={styles.main}>{children}</main>
			</div>
		</div>
	)
}
