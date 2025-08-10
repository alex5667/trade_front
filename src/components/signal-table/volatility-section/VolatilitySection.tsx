'use client'

import { useSelector } from 'react-redux'

import { VolatilityRangeComponent } from '@/components/Signals/VolatilitySignal/VolatilityRangeComponent'
import { VolatilitySpikeComponent } from '@/components/Signals/VolatilitySignal/VolatilitySpikeComponent'

import {
	selectVolatilityLastUpdated,
	selectVolatilityRangeLastUpdated,
	selectVolatilityRangeSignals,
	selectVolatilitySignals,
	selectVolatilitySpikeLastUpdated,
	selectVolatilitySpikeSignals
} from '@/store/signals/selectors/signals.selectors'

import styles from './Volatility-section.module.scss'

/**
 * VolatilitySection - Displays volatility signals from the Redux store
 */
export const VolatilitySection = () => {
	// Get signals directly from store
	const volatilitySignals = useSelector(selectVolatilitySignals)
	const spikeSignals = useSelector(selectVolatilitySpikeSignals)
	const rangeSignals = useSelector(selectVolatilityRangeSignals)

	// Get last updated timestamps
	const volatilityLastUpdated = useSelector(selectVolatilityLastUpdated)
	const spikeLastUpdated = useSelector(selectVolatilitySpikeLastUpdated)
	const rangeLastUpdated = useSelector(selectVolatilityRangeLastUpdated)

	// Debug: Log the structure of the first signal if available
	if (volatilitySignals.length > 0) {
		console.log(
			'First volatility signal structure:',
			JSON.stringify(volatilitySignals[0], null, 2)
		)
	}

	console.log('Volatility spike signals:', spikeSignals.length)
	console.log('Volatility range signals:', rangeSignals.length)

	return (
		<section className={styles.volatilitySection}>
			<h2 className={styles.sectionTitle}>Volatility Signals</h2>

			<div>
				{/* Spike signals full-width */}
				<div>
					<VolatilitySpikeComponent
						maxSignals={50}
						title='Volatility Spike Signals'
					/>
				</div>

				{/* Range signals full-width */}
				<div>
					<VolatilityRangeComponent
						maxSignals={50}
						title='Volatility Range Signals'
					/>
				</div>
			</div>
		</section>
	)
}
