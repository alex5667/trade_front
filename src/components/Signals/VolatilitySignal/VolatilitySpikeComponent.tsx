/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
	selectVolatilitySpikeLastUpdated,
	selectVolatilitySpikeSignals
} from '@/store/signals/selectors/signals.selectors'
import { VolatilitySignal } from '@/store/signals/signal.types'

import tableStyles from '../../signal-table/volume-spike-table/VolumeSpikeTable.module.scss'

import s from './VolatilitySignal.module.scss'

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

/**
 * VolatilitySpikeComponent
 * ------------------------------
 * Компонент для отображения сигналов скачков волатильности
 */

interface VolatilitySpikeComponentProps {
	maxSignals?: number
	title?: string
}

// Extended type to track highlighted fields
interface DisplaySignal extends VolatilitySignal {
	highlightVolatility?: boolean
	highlightChange?: boolean
	updatedAt?: number
}

export const VolatilitySpikeComponent: React.FC<
	VolatilitySpikeComponentProps
> = ({ maxSignals = 10, title = 'Volatility Spike Signals' }) => {
	// Получаем сигналы из Redux
	const volatilitySpikeSignals = useSelector(selectVolatilitySpikeSignals)
	const lastUpdated = useSelector(selectVolatilitySpikeLastUpdated)

	// Состояние для отфильтрованных сигналов
	const [displaySignals, setDisplaySignals] = useState<DisplaySignal[]>([])
	const previousSignalsRef = useRef<Record<string, DisplaySignal>>({})

	// Обновляем отображаемые сигналы при изменении данных
	useEffect(() => {
		// Create map of existing signals for easy lookup
		const currentSignalsMap: Record<string, DisplaySignal> = {}
		displaySignals.forEach(signal => {
			currentSignalsMap[signal.symbol] = signal
		})

		// Process new signals and update existing ones
		const updatedSignalsMap: Record<string, DisplaySignal> = {
			...currentSignalsMap
		}

		volatilitySpikeSignals.forEach(newSignal => {
			const existingSignal = updatedSignalsMap[newSignal.symbol]

			if (existingSignal) {
				// Update existing signal with highlighting
				const updatedSignal: DisplaySignal = {
					...newSignal,
					highlightVolatility:
						newSignal.volatility !== existingSignal.volatility,
					highlightChange:
						newSignal.volatilityChange !== existingSignal.volatilityChange,
					updatedAt: Date.now()
				}
				updatedSignalsMap[newSignal.symbol] = updatedSignal
			} else {
				// Add new signal
				updatedSignalsMap[newSignal.symbol] = {
					...newSignal,
					updatedAt: Date.now()
				}
			}
		})

		const toNumber = (v: unknown): number => {
			if (typeof v === 'number') return v
			if (typeof v === 'string') {
				const ms = Date.parse(v)
				return isNaN(ms) ? 0 : ms
			}
			return 0
		}

		// Convert map to array, sort by timestamp, and limit to maxSignals
		const signalsArray = Object.values(updatedSignalsMap)
			.sort(
				(a, b) =>
					toNumber(b.updatedAt ?? b.timestamp) -
					toNumber(a.updatedAt ?? a.timestamp)
			)
			.slice(0, maxSignals)

		setDisplaySignals(signalsArray)
		previousSignalsRef.current = updatedSignalsMap
	}, [volatilitySpikeSignals, maxSignals, lastUpdated])

	// Clear highlights after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setDisplaySignals(prevSignals =>
				prevSignals.map(signal => ({
					...signal,
					highlightVolatility: false,
					highlightChange: false
				}))
			)
		}, 3003)

		return () => clearTimeout(timer)
	}, [displaySignals])

	// Если нет сигналов, показываем заглушку
	if (displaySignals.length === 0) {
		return (
			<div>
				<h3 className={s.title}>{title}</h3>
				<div className={tableStyles.tableWrapper}>
					<table className={tableStyles.table}>
						<thead>
							<tr className={tableStyles.headRow}>
								<th className={tableStyles.cell}>Symbol</th>
								<th className={tableStyles.cell}>Interval</th>
								<th className={tableStyles.cell}>Volatility</th>
								<th className={tableStyles.cell}>Δ Volatility</th>
								<th className={tableStyles.cell}>Price Change</th>
								<th className={tableStyles.cell}>Time</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td
									colSpan={6}
									className={tableStyles.emptyCell}
								>
									No volatility spike signals available
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		)
	}

	// Helper to render price change percent from open/close
	const renderPriceChange = (signal: DisplaySignal) => {
		if (signal.open === undefined || signal.close === undefined) {
			return <td className={s.cell}>-</td>
		}
		const diff = signal.close - signal.open
		const percent = signal.open !== 0 ? (diff / signal.open) * 100 : 0
		const isPositive = percent > 0
		const cls = isPositive ? s.positive : percent < 0 ? s.negative : ''
		const sign = isPositive ? '+' : ''
		return (
			<td className={`${s.cell} ${cls}`}>
				{sign}
				{percent.toFixed(2)}%
			</td>
		)
	}

	return (
		<div>
			<h3 className={s.title}>{title}</h3>
			<div className={tableStyles.tableWrapper}>
				<table className={tableStyles.table}>
					<thead>
						<tr className={tableStyles.headRow}>
							<th className={tableStyles.cell}>Symbol</th>
							<th className={tableStyles.cell}>Interval</th>
							<th className={tableStyles.cell}>Volatility</th>
							<th className={tableStyles.cell}>Δ Volatility</th>
							<th className={tableStyles.cell}>Price Change</th>
							<th className={tableStyles.cell}>Time</th>
						</tr>
					</thead>
					<tbody>
						{displaySignals.map(signal => (
							<tr
								key={`${signal.symbol}-${signal.timestamp}`}
								className={tableStyles.row}
							>
								<td className={`${tableStyles.cell} ${s.symbol}`}>
									{signal.symbol}
								</td>
								<td className={tableStyles.cell}>{signal.interval || '-'}</td>
								<td
									className={`${tableStyles.cell} ${signal.highlightVolatility ? s.highlight : ''}`}
								>
									{signal.volatility !== undefined
										? signal.volatility.toFixed(4)
										: '0.0000'}
								</td>
								<td
									className={`${tableStyles.cell} ${signal.volatilityChange > 0 ? s.positive : signal.volatilityChange < 0 ? s.negative : ''} ${signal.highlightChange ? s.highlight : ''}`}
								>
									{signal.volatilityChange !== undefined
										? (signal.volatilityChange > 0 ? '+' : '') +
											signal.volatilityChange.toFixed(2)
										: '-'}
								</td>
								{renderPriceChange(signal)}
								<td className={tableStyles.cell}>
									{new Date(
										signal.updatedAt || signal.timestamp
									).toLocaleTimeString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default VolatilitySpikeComponent
