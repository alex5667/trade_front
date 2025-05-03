// 'use client'
import { memo, useEffect, useRef, useState } from 'react'

import { VolatilitySpikeSignal } from '@/types/signal.types'

import styles from './VolatilityTable.module.scss'

interface VolatilityTableProps {
	signals: VolatilitySpikeSignal[]
	title?: string
}

interface EnhancedVolatilitySpikeSignal extends VolatilitySpikeSignal {
	highlight?: boolean
}

/**
 * VolatilityTable - Displays a table of volatility signals with optimized rendering
 */
export const VolatilityTable = memo(function VolatilityTable({
	signals,
	title = 'Волатильность'
}: VolatilityTableProps) {
	const [uniqueSignals, setUniqueSignals] = useState<
		EnhancedVolatilitySpikeSignal[]
	>([])
	const prevSignalsRef = useRef<Record<string, EnhancedVolatilitySpikeSignal>>(
		{}
	)

	// Process signals only when the array changes
	useEffect(() => {
		const updatedSignals: EnhancedVolatilitySpikeSignal[] = []
		const signalsByKey: Record<string, EnhancedVolatilitySpikeSignal> = {}

		signals.forEach(signal => {
			// Use only symbol and interval for the key to ensure just one entry per symbol
			const key = `${signal.symbol}_${signal.interval}`
			const prev = prevSignalsRef.current[key]

			// Ensure numeric values
			const enhancedSignal: EnhancedVolatilitySpikeSignal = {
				...signal,
				open: Number(signal.open) || 0,
				high: Number(signal.high) || 0,
				low: Number(signal.low) || 0,
				close: Number(signal.close) || 0,
				volatility: Number(signal.volatility) || 0,
				range:
					signal.range !== undefined ? Number(signal.range) || 0 : undefined,
				avgRange:
					signal.avgRange !== undefined
						? Number(signal.avgRange) || 0
						: undefined,
				highlight:
					!!prev &&
					(prev.volatility !== signal.volatility ||
						prev.open !== signal.open ||
						prev.high !== signal.high ||
						prev.low !== signal.low ||
						prev.close !== signal.close ||
						prev.range !== signal.range ||
						prev.avgRange !== signal.avgRange)
			}

			// Always update with the latest signal for a given symbol, based on timestamp
			if (
				!signalsByKey[key] ||
				signal.timestamp >= (signalsByKey[key]?.timestamp || 0)
			) {
				signalsByKey[key] = enhancedSignal
			}
		})

		Object.values(signalsByKey).forEach(sig => updatedSignals.push(sig))
		// Sort by timestamp (newest first)
		updatedSignals.sort((a, b) => b.timestamp - a.timestamp)
		setUniqueSignals(updatedSignals)
		prevSignalsRef.current = signalsByKey

		// Log detected signals
		if (updatedSignals.length > 0) {
			console.log(
				`Processed ${updatedSignals.length} signals for: ${title}`,
				updatedSignals
			)
		}

		const timer = setTimeout(() => {
			setUniqueSignals(prev => prev.map(s => ({ ...s, highlight: false })))
		}, 1000)
		return () => clearTimeout(timer)
	}, [signals, title])

	// Format timestamp to locale time string
	const formatTimestamp = (timestamp: number): string => {
		return new Date(timestamp).toLocaleTimeString()
	}

	// Format number to fixed decimal places
	const formatNumber = (
		num: number | undefined,
		decimals: number = 4
	): string => {
		if (num === undefined || num === null) return '-'
		return Number(num).toFixed(decimals)
	}

	// Determine if we have range or avgRange columns
	const hasRange = uniqueSignals.some(s => s.range !== undefined)
	const hasAvgRange = uniqueSignals.some(s => s.avgRange !== undefined)

	// Calculate total columns for empty state colspan
	const baseCols = 8 + (hasRange ? 1 : 0) + (hasAvgRange ? 1 : 0)

	return (
		<div className={styles.tableWrapper}>
			<h3 className='text-lg font-semibold mb-2'>{title}</h3>
			<table className={styles.table}>
				<thead>
					<tr className={styles.headRow}>
						<th className={styles.cell}>Монета</th>
						<th className={styles.cell}>Интервал</th>
						<th className={styles.cell}>Открытие</th>
						<th className={styles.cell}>Макс</th>
						<th className={styles.cell}>Мин</th>
						<th className={styles.cell}>Закрытие</th>
						<th className={styles.cell}>Волатильность</th>
						{hasRange && <th className={styles.cell}>Диапазон</th>}
						{hasAvgRange && <th className={styles.cell}>Ср. диапазон</th>}
						<th className={styles.cell}>Время</th>
					</tr>
				</thead>
				<tbody>
					{uniqueSignals.length > 0 ? (
						uniqueSignals.map((signal, index) => {
							const rowClass = signal.highlight
								? `${styles.row} ${styles.highlight}`
								: styles.row
							return (
								<tr
									key={`${signal.symbol}_${signal.interval}_${index}`}
									className={rowClass}
								>
									<td className={styles.cell}>{signal.symbol}</td>
									<td className={styles.cell}>{signal.interval}</td>
									<td className={styles.cell}>{formatNumber(signal.open)}</td>
									<td className={styles.cell}>{formatNumber(signal.high)}</td>
									<td className={styles.cell}>{formatNumber(signal.low)}</td>
									<td className={styles.cell}>{formatNumber(signal.close)}</td>
									<td className={`${styles.cell} ${styles.volatilityCell}`}>
										{formatNumber(signal.volatility, 2)}%
									</td>
									{hasRange && (
										<td className={styles.cell}>
											{signal.range !== undefined
												? formatNumber(signal.range, 4)
												: '-'}
										</td>
									)}
									{hasAvgRange && (
										<td className={styles.cell}>
											{signal.avgRange !== undefined
												? formatNumber(signal.avgRange, 4)
												: '-'}
										</td>
									)}
									<td className={styles.cell}>
										{formatTimestamp(signal.timestamp)}
									</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={baseCols}
								className={styles.emptyCell}
							>
								Ожидание сигналов {title.toLowerCase()}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
})
