'use client'

import { useEffect, useState } from 'react'

import { useWebSocket } from '@/hooks/useWebSocket'

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
		<div className='p-6 max-w-4xl mx-auto space-y-6'>
			{/* Заголовок */}
			<div className='text-center'>
				<h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
					Trading Signals WebSocket
				</h1>
				<p className='text-gray-600 dark:text-gray-400 mt-2'>
					Real-time connection to trade_back server
				</p>
			</div>

			{/* Статус соединения */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
						Connection Status
					</h2>
					<div className='flex space-x-2'>
						<button
							onClick={connect}
							disabled={isConnected}
							className='px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50 hover:bg-green-600 transition-colors'
						>
							Connect
						</button>
						<button
							onClick={disconnect}
							disabled={!isConnected}
							className='px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50 hover:bg-red-600 transition-colors'
						>
							Disconnect
						</button>
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<div className='flex items-center space-x-2 mb-2'>
							<div
								className={`w-3 h-3 rounded-full ${
									isConnected ? 'bg-green-500' : 'bg-red-500'
								}`}
							/>
							<span className='font-medium'>
								{isConnected ? 'Connected' : 'Disconnected'}
							</span>
						</div>
						<div className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
							<div>URL: {connectionStatus.url}</div>
							<div>Client ID: {connectionStatus.clientId || 'N/A'}</div>
							<div>Transport: {connectionStatus.transport || 'N/A'}</div>
						</div>
					</div>

					{stats && (
						<div>
							<div className='font-medium mb-2'>Statistics</div>
							<div className='text-sm text-gray-600 dark:text-gray-400 space-y-1'>
								<div>Subscribers: {stats.subscribersCount}</div>
								<div>Signals received: {signalHistory.length}</div>
							</div>
						</div>
					)}
				</div>

				{error && (
					<div className='mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded'>
						Error: {error}
					</div>
				)}
			</div>

			{/* Последний сигнал */}
			{lastSignal && (
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
						Latest Signal
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Type
							</div>
							<div className='font-medium'>{lastSignal.type}</div>
						</div>
						{lastSignal.symbol && (
							<div>
								<div className='text-sm text-gray-600 dark:text-gray-400'>
									Symbol
								</div>
								<div className='font-medium'>{lastSignal.symbol}</div>
							</div>
						)}
						{lastSignal.change && (
							<div>
								<div className='text-sm text-gray-600 dark:text-gray-400'>
									Change
								</div>
								<div
									className={`font-medium ${getChangeColor(lastSignal.change)}`}
								>
									{formatChange(lastSignal.change)}
								</div>
							</div>
						)}
						<div>
							<div className='text-sm text-gray-600 dark:text-gray-400'>
								Time
							</div>
							<div className='font-medium'>
								{formatTime(lastSignal.timestamp)}
							</div>
						</div>
					</div>

					{lastSignal.volatility && (
						<div className='mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded'>
							<div className='text-sm text-blue-600 dark:text-blue-300'>
								Volatility: {lastSignal.volatility}%
							</div>
						</div>
					)}
				</div>
			)}

			{/* История сигналов */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
						Signal History ({signalHistory.length})
					</h2>
					<button
						onClick={() => setShowHistory(!showHistory)}
						className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
					>
						{showHistory ? 'Hide' : 'Show'} History
					</button>
				</div>

				{showHistory && (
					<div className='space-y-2 max-h-96 overflow-y-auto'>
						{signalHistory.length === 0 ? (
							<div className='text-gray-500 text-center py-4'>
								No signals received yet
							</div>
						) : (
							signalHistory.map((signal, index) => (
								<div
									key={index}
									className='p-3 border dark:border-gray-700 rounded flex justify-between items-center'
								>
									<div className='flex space-x-4'>
										<span className='font-medium'>{signal.type}</span>
										{signal.symbol && (
											<span className='text-gray-600 dark:text-gray-400'>
												{signal.symbol}
											</span>
										)}
										{signal.change && (
											<span className={getChangeColor(signal.change)}>
												{formatChange(signal.change)}
											</span>
										)}
									</div>
									<span className='text-sm text-gray-500'>
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
				<div className='bg-gray-100 dark:bg-gray-700 rounded-lg p-4'>
					<h3 className='font-medium mb-2'>Debug Information</h3>
					<pre className='text-xs overflow-x-auto'>
						{JSON.stringify({ connectionStatus, stats }, null, 2)}
					</pre>
				</div>
			)}
		</div>
	)
}
