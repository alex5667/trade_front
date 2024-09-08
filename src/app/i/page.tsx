import type { Metadata } from 'next'

import { Sidebar } from '@/components/dashboard-layout/sidebar/Sidebar'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import AdminBoard from './(admin-board)/AdminBoard'
import styles from './AdminBoard.module.scss'

export const metadata: Metadata = {
	title: 'Admin board',
	...NO_INDEX_PAGE
}

export default function AdminBoardPage() {
	return (
		<>
			<Sidebar />
			<div>
				{/* <Header /> */}
				<main className={styles.main}>
					<AdminBoard />
				</main>
			</div>
		</>
	)
}
