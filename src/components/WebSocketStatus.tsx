'use client'

import { useEffect, useState } from 'react'

import { useWebSocket } from '@/hooks/useWebSocket'

import styles from './WebSocketStatus.module.scss'

/**
 * Компонент отображения статуса WebSocket соединения и торговых сигналов
 */
export const WebSocketStatus = () => {
	const {
		isConnected,
		connectionStatus,
		lastSignal,
		signalHistory,
		error,
		connect,
		disconnect,
		getStats
	} = useWebSocket()

	const [stats, setStats] = useState<any>(null)
	const [showHistory, setShowHistory] = useState(false)

	// Обновление статистики каждые 5 секунд
	useEffect(() => {
		if (isConnected) {
			const interval = setInterval(() => {
				setStats(getStats())
			}, 5000)

			return () => clearInterval(interval)
		}
	}, [isConnected, getStats])

	// Форматирование времени
	const formatTime = (timestamp?: string) => {
		if (!timestamp) return 'N/A'
		return new Date(timestamp).toLocaleTimeString()
	}

	// Форматирование изменения цены
	const formatChange = (change?: number | string) => {
		if (typeof change === 'number') return change.toFixed(3) + '%'
		if (typeof change === 'string') return change
		return 'N/A'
	}

	// Цветовая индикация для изменений
	const getChangeColor = (change?: number | string) => {
		const numChange = typeof change === 'string' ? parseFloat(change) : change
		if (numChange && numChange > 0) return 'text-green-500'
		if (numChange && numChange < 0) return 'text-red-500'
		return 'text-gray-500'
	}

	return (
		<div className={styles.container}>
			{/* Заголовок */}
			<div className={styles.center}>
				<h1 className={styles.heading}>Trading Signals WebSocket</h1>
				<p className={styles.subtext}>
					Real-time connection to trade_back server
				</p>
			</div>

			{/* Статус соединения */}
			<div className={styles.card}>
				<div className={styles.row}>
					<h2 className={styles.h2}>Connection Status</h2>
					<div className={styles.actions}>
						<button
							onClick={connect}
							disabled={isConnected}
							className={`${styles.btn} ${styles.green}`}
						>
							Connect
						</button>
						<button
							onClick={disconnect}
							disabled={!isConnected}
							className={`${styles.btn} ${styles.red}`}
						>
							Disconnect
						</button>
					</div>
				</div>

				<div className={styles.grid}>
					<div>
						<div className={styles.rowGap}>
							<div className={styles.dot} />
							<span className={styles.k}>
								{isConnected ? 'Connected' : 'Disconnected'}
							</span>
						</div>
						<div className={styles.kv}>
							<div>URL: {connectionStatus.url}</div>
							<div>Client ID: {connectionStatus.clientId || 'N/A'}</div>
							<div>Transport: {connectionStatus.transport || 'N/A'}</div>
						</div>
					</div>

					{stats && (
						<div>
							<div className={styles.cardTitle}>Statistics</div>
							<div className={styles.kv}>
								<div>Subscribers: {stats.subscribersCount}</div>
								<div>Signals received: {signalHistory.length}</div>
							</div>
						</div>
					)}
				</div>

				{error && <div className={styles.alert}>Error: {error}</div>}
			</div>

			{/* Последний сигнал */}
			{lastSignal && (
				<div className={styles.card}>
					<h2 className={styles.cardTitle}>Latest Signal</h2>
					<div className={styles.grid4}>
						<div>
							<div className={styles.k}>Type</div>
							<div className='font-medium'>{lastSignal.type}</div>
						</div>
						{lastSignal.symbol && (
							<div>
								<div className={styles.k}>Symbol</div>
								<div className='font-medium'>{lastSignal.symbol}</div>
							</div>
						)}
						{lastSignal.change && (
							<div>
								<div className={styles.k}>Change</div>
								<div
									className={`font-medium ${getChangeColor(lastSignal.change)}`}
								>
									{formatChange(lastSignal.change)}
								</div>
							</div>
						)}
						<div>
							<div className={styles.k}>Time</div>
							<div className='font-medium'>
								{formatTime(lastSignal.timestamp)}
							</div>
						</div>
					</div>

					{lastSignal.volatility && (
						<div className={styles.badge}>
							<div>Volatility: {lastSignal.volatility}%</div>
						</div>
					)}
				</div>
			)}

			{/* История сигналов */}
			<div className={styles.card}>
				<div className={styles.row}>
					<h2 className={styles.h2}>Signal History ({signalHistory.length})</h2>
					<button
						onClick={() => setShowHistory(!showHistory)}
						className={styles.btnBlue}
					>
						{showHistory ? 'Hide' : 'Show'} History
					</button>
				</div>

				{showHistory && (
					<div className={styles.history}>
						{signalHistory.length === 0 ? (
							<div className={styles.muted}>No signals received yet</div>
						) : (
							signalHistory.map((signal, index) => (
								<div
									key={index}
									className={styles.item}
								>
									<div className={styles.rowGap}>
										<span className='font-medium'>{signal.type}</span>
										{signal.symbol && (
											<span className={styles.k}>{signal.symbol}</span>
										)}
										{signal.change && (
											<span className={getChangeColor(signal.change)}>
												{formatChange(signal.change)}
											</span>
										)}
									</div>
									<span className={styles.time}>
										{formatTime(signal.timestamp)}
									</span>
								</div>
							))
						)}
					</div>
				)}
			</div>

			{/* Debug информация */}
			{process.env.NODE_ENV === 'development' && (
				<div className={styles.debug}>
					<h3 className='font-medium mb-2'>Debug Information</h3>
					<pre className={styles.pre}>
						{JSON.stringify({ connectionStatus, stats }, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
