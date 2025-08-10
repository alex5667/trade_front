'use client'

import { useMemo } from 'react'

import { TimeframeCoin } from '@/store/signals/signal.types'

import { useTimeframeData } from '@/hooks/useTimeframeData'

import { NoDataIndicator } from '../no-data-indicator/NoDataIndicator'

import styles from './Time-table.module.scss'

interface TimeframeCoinsTableProps {
	title: string
	type: 'gainers' | 'losers'
}

const TimeframeCoinsRow = ({
	coin,
	type
}: {
	coin: TimeframeCoin
	type: 'gainers' | 'losers'
}) => {
	const changeClass = type === 'gainers' ? styles.positive : styles.negative
	return (
		<tr>
			<td>{coin.symbol}</td>
			<td>{coin.price ?? '-'}</td>
			<td className={changeClass}>
				{typeof coin.percentChange === 'number'
					? `${coin.percentChange.toFixed(2)}%`
					: '-'}
			</td>
			<td>{coin.baseVolume ?? '-'}</td>
			<td>{coin.quoteVolume ?? '-'}</td>
			<td>{coin.direction ?? '-'}</td>
			<td>
				{coin.timestamp ? new Date(coin.timestamp).toLocaleTimeString() : '-'}
			</td>
		</tr>
	)
}

export const TimeframeCoinsTable = ({
	title,
	type
}: TimeframeCoinsTableProps) => {
	const { timeframeData, isLoading, error, refetch, hasData } =
		useTimeframeData()

	const coins = useMemo(() => {
		if (!timeframeData || !timeframeData[type]) return []
		return timeframeData[type]
	}, [timeframeData, type])

	const tableHasData = useMemo(() => coins.length > 0, [coins])

	return (
		<div className={styles.tableContainer}>
			<div className='flex justify-between items-center mb-4'>
				<h3 className={styles.tableTitle}>{title}</h3>
				{!isLoading && (
					<button
						onClick={refetch}
						className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
						title='Обновить данные'
					>
						🔄
					</button>
				)}
			</div>

			{isLoading ? (
				<div className='text-center py-4'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto'></div>
					<p className='mt-2 text-gray-500'>Загрузка данных...</p>
				</div>
			) : error ? (
				<div className='text-center py-4 text-red-500'>
					<p>{error}</p>
					<button
						onClick={refetch}
						className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
					>
						Попробовать снова
					</button>
				</div>
			) : tableHasData ? (
				<table className={styles.timeframeTable}>
					<thead>
						<tr>
							<th>Монета</th>
							<th>Цена</th>
							<th>Изменение</th>
							<th>Base Volume</th>
							<th>Quote Volume</th>
							<th>Direction</th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						{coins.map((coin: TimeframeCoin) => (
							<TimeframeCoinsRow
								key={coin.symbol}
								coin={coin}
								type={type}
							/>
						))}
					</tbody>
				</table>
			) : (
				<div className='text-center py-4'>
					<NoDataIndicator />
					{!hasData && (
						<button
							onClick={refetch}
							className='mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
						>
							Загрузить данные
						</button>
					)}
				</div>
			)}
		</div>
	)
}
