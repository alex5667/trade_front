'use client'

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TimeframeCoin } from '@/types/signal.types'

import { formatNumber } from '@/utils/formatNumber'
import { formatVolumeValue } from '@/utils/formatVolumeValue'

import styles from './Time-table.module.scss'

interface TimeframeCoinsTableProps {
	coins: TimeframeCoin[]
	title: string
	timeframe: string
	isGainer: boolean
	isVolume?: boolean
	isFunding?: boolean
}

interface EnhancedTimeframeCoin extends TimeframeCoin {
	highlight: boolean
}

/**
 * TimeframeCoinsTable - Displays table of coins for a specific timeframe
 * Optimized with memoization to prevent unnecessary re-renders
 */
export const TimeframeCoinsTable = memo(function TimeframeCoinsTable({
	coins,
	title,
	timeframe,
	isGainer,
	isVolume = false,
	isFunding = false
}: TimeframeCoinsTableProps) {
	const [uniqueCoins, setUniqueCoins] = useState<EnhancedTimeframeCoin[]>([])
	const prevCoinsMapRef = useRef<Map<string, TimeframeCoin>>(new Map())

	// Debug logging for received coins
	useEffect(() => {
		console.log(`🧠 TimeframeCoinsTable (${title}) received coins:`, coins)
		if (coins && coins.length > 0) {
			console.log(`🧠 Sample coin data:`, coins[0])
		} else {
			console.log(`⚠️ No coins data received for ${title}`)
		}
	}, [coins, title])

	// Process coins only when the array changes
	useEffect(() => {
		// Create a map of existing coins for quick lookup
		const prevCoinsMap = prevCoinsMapRef.current

		// Debug: log incoming coins data
		console.log(`�� Processing ${coins?.length || 0} coins for ${title}`)

		// Ensure coins is an array
		if (!coins || !Array.isArray(coins)) {
			console.error(`❌ Expected coins to be an array but got:`, coins)
			setUniqueCoins([])
			return
		}

		// Map coins to enhanced coins with highlight for new/changed entries
		const enhancedCoins: EnhancedTimeframeCoin[] = coins.map(coin => {
			const prevCoin = prevCoinsMap.get(coin.symbol)
			const isNew = !prevCoin
			const hasChanged =
				prevCoin &&
				(prevCoin.change !== coin.change ||
					(coin.value !== undefined && prevCoin.value !== coin.value))

			return {
				...coin,
				highlight: isNew || hasChanged ? true : false
			}
		})

		setUniqueCoins(enhancedCoins)
		console.log(`✅ Set ${enhancedCoins.length} unique coins for ${title}`)

		// Store current coins for next comparison
		const newCoinsMap = new Map<string, TimeframeCoin>()
		coins.forEach(coin => {
			newCoinsMap.set(coin.symbol, coin)
		})
		prevCoinsMapRef.current = newCoinsMap

		// Reset highlights after 1 second
		const timer = setTimeout(() => {
			setUniqueCoins(prev =>
				prev.map(coin => ({
					...coin,
					highlight: false
				}))
			)
		}, 1000)

		return () => clearTimeout(timer)
	}, [coins, title])

	// Format value for percentage changes
	const formatPercentChange = useCallback((value: string): string => {
		if (!value) return '0.000%'

		// Remove any existing % symbol if present
		const cleanValue = value.replace('%', '').trim()

		// Try to parse the numeric value
		const numericValue = Number(cleanValue)

		// If it's a valid number, format with 3 decimal places
		if (!isNaN(numericValue)) {
			return `${numericValue.toFixed(3)}%`
		}

		// If parsing failed, return original with % appended if not present
		return value.includes('%') ? value : `${value}%`
	}, [])

	// Determine table title based on table type
	const tableTitle = useMemo(
		() => (
			<h3 className={styles.tableHeader}>
				{isFunding
					? 'Фандинг'
					: isVolume
						? 'Топ'
						: isGainer
							? 'Растущие'
							: 'Падающие'}{' '}
				монеты ({timeframe})
			</h3>
		),
		[isFunding, isVolume, isGainer, timeframe]
	)

	// Format symbol by removing USDT and converting to uppercase
	const formatSymbol = useCallback((symbol: string): string => {
		return symbol.replace('USDT', '').toUpperCase()
	}, [])

	// Render formatted change value with appropriate styling
	const renderChangeValue = useCallback(
		(change: string) => {
			const isNegative = change.startsWith('-')
			const changeClass = isNegative ? styles.negative : styles.positive

			return (
				<td className={`${styles.changeCell} ${changeClass}`}>
					{formatPercentChange(change)}
				</td>
			)
		},
		[formatPercentChange]
	)

	// Determine whether a coin change is positive or negative
	const getChangeColorClass = useCallback((change: string) => {
		return change.startsWith('-') ? styles.negative : styles.positive
	}, [])

	// Format percentage values for display
	const formatPercentValue = useCallback(
		(value: string | undefined): string => {
			if (!value) return '0%'
			const numValue = parseFloat(value)
			return isNaN(numValue) ? '0%' : `${numValue}%`
		},
		[]
	)

	// Calculate column count based on table type
	const columnCount = useMemo(() => {
		if (isVolume) return 7 // Symbol, Volume, Change, 1h%, 2h%, 5h%, 10h%
		if (isFunding) return 3 // Symbol, Rate, Change
		return 2 // Symbol, Change
	}, [isVolume, isFunding])

	// Render empty state message
	const renderEmptyState = useCallback(
		() => (
			<tr>
				<td
					colSpan={columnCount}
					className={styles.emptyMessage}
				>
					Ожидание сигналов {title}...
				</td>
			</tr>
		),
		[title, columnCount]
	)

	return (
		<div className={styles.tableContainer}>
			{tableTitle}
			<table className={styles.table}>
				<thead>
					<tr className={styles.tableHeaderRow}>
						<th className={styles.headerCell}>Монета</th>
						{isVolume ? (
							<>
								<th className={styles.headerCell}>Объем</th>
								<th className={styles.headerCell}>Изм. %</th>
								<th className={styles.headerCell}>%</th>
								<th className={styles.headerCell}>2%</th>
								<th className={styles.headerCell}>5%</th>
								<th className={styles.headerCell}>10%</th>
							</>
						) : isFunding ? (
							<>
								<th className={styles.headerCell}>Ставка</th>
								<th className={styles.headerCell}>Изменение</th>
							</>
						) : (
							<th className={styles.headerCell}>Изменение</th>
						)}
					</tr>
				</thead>
				<tbody>
					{uniqueCoins.length > 0
						? uniqueCoins.map(coin => {
								const rowClass = coin.highlight
									? `${styles.tableRow} ${styles.highlighted}`
									: styles.tableRow

								const changeColorClass = getChangeColorClass(coin.change)

								return (
									<tr
										key={coin.symbol}
										className={rowClass}
									>
										<td className={styles.symbolCell}>
											{formatSymbol(coin.symbol)}
										</td>

										{isVolume ? (
											<>
												<td className={styles.volumeCell}>
													{formatVolumeValue(coin.value)}
												</td>
												{renderChangeValue(coin.change)}
												<td className={styles.percentCell}>
													{formatPercentValue(coin.volumePercent)}
												</td>
												<td className={styles.percentCell}>
													{formatNumber(coin.volume2Percent)}
												</td>
												<td className={styles.percentCell}>
													{formatNumber(coin.volume5Percent)}
												</td>
												<td className={styles.percentCell}>
													{formatNumber(coin.volume10Percent)}
												</td>
											</>
										) : isFunding ? (
											<>
												<td
													className={`${styles.dataCell} ${changeColorClass}`}
												>
													{formatPercentChange(coin.change)}
												</td>
												<td
													className={`${styles.changeCell} ${changeColorClass}`}
												>
													{coin.value !== undefined
														? parseFloat(coin.value.toString()).toFixed(3) + '%'
														: '0.000%'}
												</td>
											</>
										) : (
											<td
												className={`${styles.changeCell} ${changeColorClass}`}
											>
												{formatPercentChange(coin.change)}
											</td>
										)}
									</tr>
								)
							})
						: renderEmptyState()}
				</tbody>
			</table>
		</div>
	)
})
