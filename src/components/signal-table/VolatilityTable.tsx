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
			const key = `${signal.symbol}_${signal.interval}`
			const prev = prevSignalsRef.current[key]
			const enhanced: EnhancedVolatilitySpikeSignal = {
				...signal,
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
			if (
				!signalsByKey[key] ||
				signal.timestamp > signalsByKey[key].timestamp
			) {
				signalsByKey[key] = enhanced
			}
		})

		Object.values(signalsByKey).forEach(sig => updatedSignals.push(sig))
		updatedSignals.sort((a, b) => b.timestamp - a.timestamp)
		setUniqueSignals(updatedSignals)
		prevSignalsRef.current = signalsByKey

		const timer = setTimeout(() => {
			setUniqueSignals(prev => prev.map(s => ({ ...s, highlight: false })))
		}, 1000)
		return () => clearTimeout(timer)
	}, [signals])

	// Format timestamp to locale time string
	const formatTimestamp = (timestamp: number): string => {
		return new Date(timestamp).toLocaleTimeString()
	}

	// Determine if we have range or avgRange columns
	const hasRange = uniqueSignals[0]?.range !== undefined
	const hasAvgRange = uniqueSignals[0]?.avgRange !== undefined

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
						uniqueSignals.map(signal => {
							const rowClass = signal.highlight
								? `${styles.row} ${styles.highlight}`
								: styles.row
							return (
								<tr
									key={`${signal.symbol}_${signal.interval}`}
									className={rowClass}
								>
									<td className={styles.cell}>{signal.symbol}</td>
									<td className={styles.cell}>{signal.interval}</td>
									<td className={styles.cell}>{signal.open}</td>
									<td className={styles.cell}>{signal.high}</td>
									<td className={styles.cell}>{signal.low}</td>
									<td className={styles.cell}>{signal.close}</td>
									<td className={`${styles.cell} ${styles.volatilityCell}`}>
										{signal.volatility}%
									</td>
									{signal.range !== undefined && (
										<td className={styles.cell}>{signal.range}</td>
									)}
									{signal.avgRange !== undefined && (
										<td className={styles.cell}>{signal.avgRange}</td>
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
