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

		// Convert map to array, sort by timestamp, and limit to maxSignals
		const signalsArray = Object.values(updatedSignalsMap)
			.sort(
				(a, b) => (b.updatedAt || b.timestamp) - (a.updatedAt || a.timestamp)
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
			<div className='p-4 border rounded-md bg-gray-50'>
				<h3 className='text-lg font-semibold mb-2'>{title}</h3>
				<p className='text-gray-500'>No volatility spike signals available</p>
			</div>
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
								<td
									className={`px-2 py-2 whitespace-nowrap text-sm text-gray-500 ${signal.highlightVolatility ? 'bg-yellow-100 transition-colors duration-500' : ''}`}
								>
									{signal.volatility !== undefined
										? signal.volatility.toFixed(4)
										: '0.0000'}
								</td>
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

export default VolatilitySpikeComponent
