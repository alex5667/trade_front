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

import s from './VolatilitySignal.module.scss'

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
			<div className={s.emptyBox}>
				<h3 className={s.title}>{title}</h3>
				<p className={s.emptyText}>No volatility signals available</p>
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
							<th className={s.headCell}>Value</th>
							<th className={s.headCell}>Change</th>
							{showType && <th className={s.headCell}>Type</th>}
							<th className={s.headCell}>Time</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{combinedSignals.map(signal => (
							<tr
								key={`${signal.symbol}-${signal.timestamp}-${signal.signalType}`}
								className={s.row}
							>
								<td className={`${s.cell} ${s.symbol}`}>{signal.symbol}</td>
								<td className={s.cell}>
									{signal.volatility !== undefined
										? signal.volatility.toFixed(4)
										: '0.0000'}
								</td>
								<td
									className={`${s.cell} ${signal.volatilityChange !== undefined && signal.volatilityChange > 0 ? s.positive : s.negative}`}
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
									<td className={s.cell}>
										{signal.signalType === 'volatilitySpike'
											? 'Spike'
											: 'Range'}
									</td>
								)}
								<td className={s.cell}>
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
