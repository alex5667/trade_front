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

		// Convert map to array, sort by timestamp, and limit to maxSignals
		const signalsArray = Object.values(updatedSignalsMap)
			.sort(
				(a, b) => (b.updatedAt || b.timestamp) - (a.updatedAt || a.timestamp)
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
			<div className='p-4 border rounded-md bg-gray-50'>
				<h3 className='text-lg font-semibold mb-2'>{title}</h3>
				<p className='text-gray-500'>No volatility range signals available</p>
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
		const changeClass = isPositive
			? 'text-green-500'
			: change < 0
				? 'text-red-500'
				: 'text-gray-500'
		const highlightClass = signal.highlightPercentDiff
			? 'bg-yellow-100 transition-colors duration-500'
			: ''

		// Форматируем значение для отображения
		const formattedChange = change.toFixed(2)

		return (
			<td
				className={`px-2 py-2 whitespace-nowrap text-sm ${changeClass} ${highlightClass}`}
			>
				{isPositive ? '+' : ''}
				{formattedChange}%
			</td>
		)
	}

	return (
		<div className='p-4 border rounded-md'>
			<h3 className='text-lg font-semibold mb-2'>{title}</h3>
			<div className='overflow-auto max-h-96'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Symbol
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Volatility
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Range
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Avg Range
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								% Diff
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Time
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{displaySignals.map(signal => (
							<tr key={`${signal.symbol}-${signal.timestamp}`}>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
									{signal.symbol}
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
									{signal.volatility !== undefined
										? `${signal.volatility.toFixed(2)}%`
										: '-'}
								</td>
								<td
									className={`px-2 py-2 whitespace-nowrap text-sm text-gray-500 ${signal.highlightRange ? 'bg-yellow-100 transition-colors duration-500' : ''}`}
								>
									{signal.range !== undefined ? signal.range.toFixed(6) : '-'}
								</td>
								<td
									className={`px-2 py-2 whitespace-nowrap text-sm text-gray-500 ${signal.highlightAvgRange ? 'bg-yellow-100 transition-colors duration-500' : ''}`}
								>
									{signal.avgRange !== undefined
										? signal.avgRange.toFixed(6)
										: '-'}
								</td>
								{renderPercentChange(signal)}
								<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
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
