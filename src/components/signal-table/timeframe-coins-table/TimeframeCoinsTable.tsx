'use client'

import { useMemo } from 'react'

import { TimeframeCoin } from '@/store/signals/signal.types'

import { useTimeframeData } from '@/hooks/useTimeframeData'

import { NoDataIndicator } from '../no-data-indicator/NoDataIndicator'

import styles from './TimeframeCoinsTable.module.scss'

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
			<div className={styles.headerRow}>
				<h3 className={styles.tableTitle}>{title}</h3>
				{!isLoading && (
					<button
						onClick={refetch}
						className={styles.refreshButton}
						title='Обновить данные'
					>
						🔄
					</button>
				)}
			</div>

			{isLoading ? (
				<div className={styles.loadingWrap}>
					<div className={styles.spinner}></div>
					<p className={styles.loadingText}>Загрузка данных...</p>
				</div>
			) : error ? (
				<div className={styles.errorWrap}>
					<p>{error}</p>
					<button
						onClick={refetch}
						className={styles.errorButton}
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
				<div className={styles.emptyWrap}>
					<NoDataIndicator />
					{!hasData && (
						<button
							onClick={refetch}
							className={styles.loadButton}
						>
							Загрузить данные
						</button>
					)}
				</div>
			)}
		</div>
	)
}
