'use client'

import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { Header } from '@/components/dashboard-layout/header/Header'
import Sidebar from '@/components/dashboard-layout/sidebar/Sidebar'
import { SignalSocketInitializer } from '@/components/signal-table/SignalSocketInitializer'

// Импортируем утилиту отладки для доступа через window
import '@/utils/debug-websocket'

import styles from './IPage.module.scss'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	useEffect(() => {
		// Выводим подсказку в консоль при загрузке
		console.log('💡 WebSocket Debug Utils доступны!')
		console.log('Запустите в консоли: window.__debugWS()')
		console.log('Или: window.__debugWebSocket.checkAll()')
	}, [])

	return (
		<div className={styles.dashBoardWrapper}>
			<SignalSocketInitializer />

			<Sidebar />
			<div className={styles.sidebarHeaderWrap}>
				<Header />
				<main className={styles.main}>{children}</main>
			</div>
		</div>
	)
}
