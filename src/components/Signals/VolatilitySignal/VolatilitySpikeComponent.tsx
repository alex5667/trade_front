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
		}, 3000)

		return () => clearTimeout(timer)
	}, [displaySignals])

	// Если нет сигналов, показываем заглушку
	if (displaySignals.length === 0) {
		return (
			<div className={s.emptyBox}>
				<h3 className={s.title}>{title}</h3>
				<p className={s.emptyText}>No volatility spike signals available</p>
			</div>
		)
	}

	return (
		<div className={s.container}>
			<h3 className={s.title}>{title}</h3>
			<div className={s.scroll}>
				<table className={s.table}>
					<thead className={s.thead}>
						<tr>
							<th className={s.headCell}>Symbol</th>
							<th className={s.headCell}>Interval</th>
							<th className={s.headCell}>Volatility</th>
							<th className={s.headCell}>Δ Volatility</th>
							<th className={s.headCell}>Time</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{displaySignals.map(signal => (
							<tr
								key={`${signal.symbol}-${signal.timestamp}`}
								className={s.row}
							>
								<td className={`${s.cell} ${s.symbol}`}>{signal.symbol}</td>
								<td className={s.cell}>{signal.interval || '-'}</td>
								<td
									className={`${s.cell} ${signal.highlightVolatility ? s.highlight : ''}`}
								>
									{signal.volatility !== undefined
										? signal.volatility.toFixed(4)
										: '0.0000'}
								</td>
								<td
									className={`${s.cell} ${signal.volatilityChange > 0 ? s.positive : signal.volatilityChange < 0 ? s.negative : ''} ${signal.highlightChange ? s.highlight : ''}`}
								>
									{signal.volatilityChange !== undefined
										? (signal.volatilityChange > 0 ? '+' : '') +
											signal.volatilityChange.toFixed(2)
										: '-'}
								</td>
								<td className={s.cell}>
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
