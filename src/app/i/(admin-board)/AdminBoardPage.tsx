import { Metadata } from 'next'

import styles from './AdminBoardPage.module.scss'

export const metadata: Metadata = {
	title: 'Админ панель'
}

const AdminBoardPage = () => {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Админ панель</h1>
		</div>
	)
}

export default AdminBoardPage
