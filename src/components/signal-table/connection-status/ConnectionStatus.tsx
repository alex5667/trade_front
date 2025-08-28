'use client'

/**
 * ConnectionStatus Component
 * ------------------------------
 * Displays the current Socket.IO connection status
 */
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import {
	selectConnectionError,
	selectConnectionStatus
} from '@/store/signals/selectors/signals.selectors'

import styles from './ConnectionStatus.module.scss'

export const ConnectionStatus = () => {
	const isConnected = useSelector(selectConnectionStatus)
	const lastError = useSelector(selectConnectionError)
	const [visible, setVisible] = useState(true)
	const [attempts, setAttempts] = useState<number>(0)

	useEffect(() => {
		if (isConnected) setVisible(false)
		else setVisible(true)
	}, [isConnected])

	useEffect(() => {
		// Периодически обновляем статистику попыток из socket-io клиента, если доступно
		const interval = setInterval(() => {
			try {
				const w: any = window as any
				// Если сервис экспонирует глобально статистику, можно читать; иначе оставим ноль
				const stats = w.__socketStats?.()
				if (stats?.reconnectAttempts !== undefined)
					setAttempts(stats.reconnectAttempts)
			} catch {}
		}, 3003)
		return () => clearInterval(interval)
	}, [])

	const bannerText = useMemo(() => {
		if (isConnected) return 'Connected'
		return lastError ? `Disconnected: ${lastError}` : 'Disconnected'
	}, [isConnected, lastError])

	const handleManualReconnect = () => {
		console.log('Manual reconnect requested (auto-retry is enabled)')
	}

	return (
		<div className={styles.wrap}>
			<div
				className={`${styles.dot} ${isConnected ? styles.green : styles.red}`}
			/>
			<div className={styles.text}>{bannerText}</div>
			{!isConnected && (
				<>
					<div className={styles.err}>
						Auto-retry with backoff. Attempts: {attempts}
					</div>
					<button
						onClick={handleManualReconnect}
						className={styles.reconnect}
					>
						Retry
					</button>
				</>
			)}
		</div>
	)
}
