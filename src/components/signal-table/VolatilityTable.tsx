'use client'

import { useEffect, useRef, useState } from 'react'

import { VolatilitySpikeSignal } from '@/types/signal.types'

interface VolatilityTableProps {
	signals: VolatilitySpikeSignal[]
	title?: string
}

interface EnhancedVolatilitySpikeSignal extends VolatilitySpikeSignal {
	highlight?: boolean
}

export function VolatilityTable({
	signals,
	title = 'Волатильность'
}: VolatilityTableProps) {
	const [uniqueSignals, setUniqueSignals] = useState<
		EnhancedVolatilitySpikeSignal[]
	>([])
	const prevSignalsRef = useRef<{
		[key: string]: EnhancedVolatilitySpikeSignal
	}>({})

	useEffect(() => {
		const updatedSignals: EnhancedVolatilitySpikeSignal[] = []
		const signalsBySymbol: { [key: string]: EnhancedVolatilitySpikeSignal } = {}

		// First pass: organize signals by symbol to create a unique set
		signals.forEach(signal => {
			const key = `${signal.symbol}_${signal.interval}`

			// Compare with previous signal to detect changes
			const prevSignal = prevSignalsRef.current[key]
			const enhancedSignal: EnhancedVolatilitySpikeSignal = {
				...signal,
				highlight:
					prevSignal &&
					(prevSignal.volatility !== signal.volatility ||
						prevSignal.open !== signal.open ||
						prevSignal.high !== signal.high ||
						prevSignal.low !== signal.low ||
						prevSignal.close !== signal.close ||
						prevSignal.range !== signal.range ||
						prevSignal.avgRange !== signal.avgRange)
			}

			// Only keep the most recent signal for each symbol
			if (
				!signalsBySymbol[key] ||
				signal.timestamp > signalsBySymbol[key].timestamp
			) {
				signalsBySymbol[key] = enhancedSignal
			}
		})

		// Convert map to array and sort by timestamp (most recent first)
		Object.values(signalsBySymbol).forEach(signal => {
			updatedSignals.push(signal)
		})

		// Sort by timestamp (most recent first)
		updatedSignals.sort((a, b) => b.timestamp - a.timestamp)

		setUniqueSignals(updatedSignals)

		// Store current signals for next comparison
		prevSignalsRef.current = signalsBySymbol

		// Reset highlight after 1 second
		const timer = setTimeout(() => {
			setUniqueSignals(prev =>
				prev.map(signal => ({
					...signal,
					highlight: false
				}))
			)
		}, 1000)

		return () => clearTimeout(timer)
	}, [signals])

	return (
		<div className='overflow-x-auto'>
			<h3 className='text-lg font-semibold mb-2'>{title}</h3>
			<table className='w-full text-sm border'>
				<thead>
					<tr className='bg-gray-100 dark:bg-gray-800'>
						<th className='p-2 border'>Монета</th>
						<th className='p-2 border'>Интервал</th>
						<th className='p-2 border'>Открытие</th>
						<th className='p-2 border'>Макс</th>
						<th className='p-2 border'>Мин</th>
						<th className='p-2 border'>Закрытие</th>
						<th className='p-2 border'>Волатильность</th>
						{uniqueSignals.length > 0 &&
							uniqueSignals[0].range !== undefined && (
								<th className='p-2 border'>Диапазон</th>
							)}
						{uniqueSignals.length > 0 &&
							uniqueSignals[0].avgRange !== undefined && (
								<th className='p-2 border'>Ср. диапазон</th>
							)}
						<th className='p-2 border'>Время</th>
					</tr>
				</thead>
				<tbody>
					{uniqueSignals.length > 0 ? (
						uniqueSignals.map((signal, idx) => {
							// Extract timestamp
							const date = new Date(signal.timestamp)
							const timeString = date.toLocaleTimeString()

							const highlightClass = signal.highlight
								? 'bg-yellow-100 dark:bg-yellow-800/30 transition-colors duration-1000'
								: ''

							return (
								<tr
									key={`${signal.symbol}_${signal.interval}`}
									className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${highlightClass}`}
								>
									<td className='p-2 border'>{signal.symbol}</td>
									<td className='p-2 border'>{signal.interval}</td>
									<td className='p-2 border'>{signal.open}</td>
									<td className='p-2 border'>{signal.high}</td>
									<td className='p-2 border'>{signal.low}</td>
									<td className='p-2 border'>{signal.close}</td>
									<td className='p-2 border text-red-600 font-bold'>
										{signal.volatility}%
									</td>
									{signal.range !== undefined && (
										<td className='p-2 border'>{signal.range}</td>
									)}
									{signal.avgRange !== undefined && (
										<td className='p-2 border'>{signal.avgRange}</td>
									)}
									<td className='p-2 border'>{timeString}</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={9}
								className='p-4 text-center'
							>
								Ожидание сигналов {title.toLowerCase()}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
