/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
	selectVolatilityRangeLastUpdated,
	selectVolatilityRangeSignals
} from '@/store/signals/selectors/signals.selectors'
import { VolatilitySignal } from '@/store/signals/signal.types'

import s from './VolatilitySignal.module.scss'

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

/**
 * VolatilityRangeComponent
 * ------------------------------
 * Компонент для отображения сигналов диапазона волатильности
 */

interface VolatilityRangeComponentProps {
	maxSignals?: number
	title?: string
}

// Extended type to track highlighted fields
interface DisplaySignal extends VolatilitySignal {
	highlightRange?: boolean
	highlightAvgRange?: boolean
	highlightPercentDiff?: boolean
	updatedAt?: number
}

export const VolatilityRangeComponent: React.FC<
	VolatilityRangeComponentProps
> = ({ maxSignals = 10, title = 'Volatility Range Signals' }) => {
	// Получаем сигналы из Redux
	const volatilityRangeSignals = useSelector(selectVolatilityRangeSignals)
	const lastUpdated = useSelector(selectVolatilityRangeLastUpdated)

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

		volatilityRangeSignals.forEach(newSignal => {
			const existingSignal = updatedSignalsMap[newSignal.symbol]

			if (existingSignal) {
				// Update existing signal with highlighting
				const updatedSignal: DisplaySignal = {
					...newSignal,
					highlightRange: newSignal.range !== existingSignal.range,
					highlightAvgRange: newSignal.avgRange !== existingSignal.avgRange,
					highlightPercentDiff:
						newSignal.volatilityChange !== existingSignal.volatilityChange ||
						newSignal.rangeRatio !== existingSignal.rangeRatio,
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
	}, [volatilityRangeSignals, maxSignals, lastUpdated])

	// Clear highlights after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setDisplaySignals(prevSignals =>
				prevSignals.map(signal => ({
					...signal,
					highlightRange: false,
					highlightAvgRange: false,
					highlightPercentDiff: false
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
				<p className={s.emptyText}>No volatility range signals available</p>
			</div>
		)
	}

	// Помощник для безопасного отображения процентного изменения
	const renderPercentChange = (signal: DisplaySignal) => {
		let change = 0

		// Используем volatilityChange если он доступен
		if (signal.volatilityChange !== undefined) {
			change = signal.volatilityChange
		} else {
			// Вычисляем процентное изменение на основе range и avgRange
			if (
				signal.range !== undefined &&
				signal.avgRange !== undefined &&
				signal.avgRange > 0
			) {
				// Формула: ((current_range - avg_range) / avg_range) * 100
				change = ((signal.range - signal.avgRange) / signal.avgRange) * 100
			} else if (signal.rangeRatio !== undefined) {
				// Или используем rangeRatio для вычисления
				change = (signal.rangeRatio - 1) * 100
			} else {
				// По умолчанию 0, если нет данных для вычисления или avgRange = 0
				change = 0
			}
		}

		// Определяем знак и цвет
		const isPositive = change > 0
		const cls = isPositive ? s.positive : change < 0 ? s.negative : s.cell
		const highlightClass = signal.highlightPercentDiff ? s.highlight : ''

		// Форматируем значение для отображения
		const formattedChange = change.toFixed(2)

		return (
			<td className={`${s.cell} ${cls} ${highlightClass}`}>
				{isPositive ? '+' : ''}
				{formattedChange}%
			</td>
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
							<th className={s.headCell}>Volatility</th>
							<th className={s.headCell}>Range</th>
							<th className={s.headCell}>Avg Range</th>
							<th className={s.headCell}>Change</th>
							<th className={s.headCell}>% Diff</th>
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
								<td className={s.cell}>
									{signal.volatility !== undefined
										? `${signal.volatility.toFixed(2)}%`
										: '-'}
								</td>
								<td
									className={`${s.cell} ${signal.highlightRange ? s.highlight : ''}`}
								>
									{signal.range !== undefined ? signal.range.toFixed(6) : '-'}
								</td>
								<td
									className={`${s.cell} ${signal.highlightAvgRange ? s.highlight : ''}`}
								>
									{signal.avgRange !== undefined
										? signal.avgRange.toFixed(6)
										: '-'}
								</td>
								<td
									className={`${s.cell} ${signal.volatilityChange !== undefined && signal.volatilityChange > 0 ? s.positive : signal.volatilityChange !== undefined && signal.volatilityChange < 0 ? s.negative : ''}`}
								>
									{signal.volatilityChange !== undefined
										? `${signal.volatilityChange > 0 ? '+' : ''}${signal.volatilityChange.toFixed(2)}%`
										: '-'}
								</td>
								{renderPercentChange(signal)}
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

export default VolatilityRangeComponent
