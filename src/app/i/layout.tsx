import type { PropsWithChildren } from 'react'

import styles from './AdminBoard.module.scss'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return <div className={styles.dashBoardWrapper}>{children}</div>
}
