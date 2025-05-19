/**
 * VolatilitySignalComponent
 * ------------------------------
 * Base component for volatility signals
 */
'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
	selectVolatilityLastUpdated,
	selectVolatilityRangeLastUpdated,
	selectVolatilityRangeSignals,
	selectVolatilitySpikeLastUpdated,
	selectVolatilitySpikeSignals
} from '@/store/signals/selectors/signals.selectors'
import { VolatilitySignal } from '@/store/signals/signal.types'

/**
 * VolatilitySignalComponent
 * ------------------------------
 * Base component for volatility signals
 */

/**
 * VolatilitySignalComponent
 * ------------------------------
 * Base component for volatility signals
 */

/**
 * VolatilitySignalComponent
 * ------------------------------
 * Base component for volatility signals
 */

interface VolatilitySignalComponentProps {
	maxSignals?: number
	title?: string
	showType?: boolean
}

export const VolatilitySignalComponent: React.FC<
	VolatilitySignalComponentProps
> = ({ maxSignals = 10, title = 'Volatility Signals', showType = true }) => {
	// Select signals from different slices
	const volatilitySpikeSignals = useSelector(selectVolatilitySpikeSignals)
	const volatilityRangeSignals = useSelector(selectVolatilityRangeSignals)

	// Track last updates
	const volatilityLastUpdated = useSelector(selectVolatilityLastUpdated)
	const volatilitySpikeLastUpdated = useSelector(
		selectVolatilitySpikeLastUpdated
	)
	const volatilityRangeLastUpdated = useSelector(
		selectVolatilityRangeLastUpdated
	)

	// Combined signals
	const [combinedSignals, setCombinedSignals] = useState<VolatilitySignal[]>([])

	// Update combined signals when any of the sources change
	useEffect(() => {
		// Combine and sort by timestamp (newest first)
		const allSignals = [...volatilitySpikeSignals, ...volatilityRangeSignals]
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, maxSignals)

		setCombinedSignals(allSignals)
	}, [
		volatilitySpikeSignals,
		volatilityRangeSignals,
		maxSignals,
		volatilityLastUpdated,
		volatilitySpikeLastUpdated,
		volatilityRangeLastUpdated
	])

	if (combinedSignals.length === 0) {
		return (
			<div className='p-4 border rounded-md bg-gray-50'>
				<h3 className='text-lg font-semibold mb-2'>{title}</h3>
				<p className='text-gray-500'>No volatility signals available</p>
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
								Value
							</th>
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Change
							</th>
							{showType && (
								<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Type
								</th>
							)}
							<th className='px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Time
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{combinedSignals.map(signal => (
							<tr
								key={`${signal.symbol}-${signal.timestamp}-${signal.signalType}`}
							>
								<td className='px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
									{signal.symbol}
								</td>
								<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
									{signal.volatility !== undefined
										? signal.volatility.toFixed(4)
										: '0.0000'}
								</td>
								<td
									className={`px-2 py-2 whitespace-nowrap text-sm ${signal.volatilityChange !== undefined && signal.volatilityChange > 0 ? 'text-green-500' : 'text-red-500'}`}
								>
									{signal.volatilityChange !== undefined &&
									signal.volatilityChange > 0
										? '+'
										: ''}
									{signal.volatilityChange !== undefined
										? signal.volatilityChange.toFixed(2)
										: '0.00'}
									%
								</td>
								{showType && (
									<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
										{signal.signalType === 'volatilitySpike'
											? 'Spike'
											: 'Range'}
									</td>
								)}
								<td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
									{new Date(signal.timestamp).toLocaleTimeString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default VolatilitySignalComponent
