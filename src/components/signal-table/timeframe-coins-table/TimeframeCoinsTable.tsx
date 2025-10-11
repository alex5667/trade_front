'use client'

import { useEffect, useMemo } from 'react'

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
			<td className={`${styles.cell} ${styles.left}`}>{coin.symbol}</td>
			<td className={`${styles.cell} ${styles.right}`}>{coin.price ?? '-'}</td>
			<td className={`${styles.cell} ${styles.right} ${changeClass}`}>
				{typeof coin.percentChange === 'number'
					? `${Number(coin.percentChange).toFixed(2)}%`
					: coin.percentChange !== undefined
						? `${Number(coin.percentChange).toFixed(2)}%`
						: '-'}
			</td>
			<td className={`${styles.cell} ${styles.right}`}>
				{coin.quoteVolume ?? '-'}
			</td>
			<td className={`${styles.cell} ${styles.right}`}>
				{coin.timestamp
					? new Date(coin.timestamp).toLocaleString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit'
						})
					: '-'}
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

	// Debug logging to track data and detect duplicates
	useEffect(() => {
		if (coins.length > 0) {
			const symbols = coins.map(coin => coin.symbol)
			const uniqueSymbols = new Set(symbols)
			if (symbols.length !== uniqueSymbols.size) {
				console.warn(`⚠️ Duplicate symbols detected in ${type}:`, {
					total: symbols.length,
					unique: uniqueSymbols.size,
					duplicates: symbols.filter(
						(symbol, index) => symbols.indexOf(symbol) !== index
					)
				})
			} else {
				console.log(`✅ ${type} table: ${coins.length} unique symbols`)
			}
		}
	}, [coins, type])

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
							<th className={`${styles.headCell} ${styles.left}`}>Монета</th>
							<th className={`${styles.headCell} ${styles.right}`}>Цена</th>
							<th className={`${styles.headCell} ${styles.right}`}>
								Изменение
							</th>
							<th className={`${styles.headCell} ${styles.right}`}>
								Quote Volume
							</th>
							<th className={`${styles.headCell} ${styles.right}`}>
								Дата/Время
							</th>
						</tr>
					</thead>
					<tbody>
						{coins.map((coin: TimeframeCoin, idx: number) => (
							<TimeframeCoinsRow
								key={`${coin.symbol}-${coin.timestamp ?? idx}`}
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
