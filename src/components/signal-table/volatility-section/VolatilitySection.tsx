'use client'

import {
	PriceChangeSignal,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'

import { VolatilityTable } from '../volatility-table/VolatilityTable'

import styles from './Volatility-section.module.scss'

interface VolatilitySectionProps {
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeSignal[]
	priceChangeSignals: PriceChangeSignal[]
}

/**
 * VolatilitySection - Displays volatility, volume and price change tables
 */
export const VolatilitySection = ({
	volatilitySignals,
	volumeSignals,
	priceChangeSignals
}: VolatilitySectionProps) => {
	// Debug: Log the structure of the first signal if available
	if (volatilitySignals.length > 0) {
		console.log(
			'First volatility signal structure:',
			JSON.stringify(volatilitySignals[0], null, 2)
		)
	}

	// Just display all volatility signals for now
	console.log('Volatility signals count:', volatilitySignals.length)

	return (
		<section className={styles.volatilitySection}>
			<h2 className={styles.sectionTitle}>Volatility Signals</h2>

			{/* Display all signals */}
			{volatilitySignals.length > 0 && (
				<VolatilityTable
					signals={volatilitySignals}
					title='All Volatility Signals'
				/>
			)}
		</section>
	)
}
