'use client'

import { AllTradingData } from '@/types/all-traiding.types'

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
	marketsData?: AllTradingData
}

/**
 * VolatilitySection - Displays volatility, volume and price change tables
 */
export const VolatilitySection = ({
	volatilitySignals,
	volumeSignals,
	priceChangeSignals,
	marketsData
}: VolatilitySectionProps) => {
	// Filter volatility signals by type if needed
	const volatilitySpikes = volatilitySignals.filter(
		signal => !signal.range && !signal.avgRange
	)

	const volatilityRanges = volatilitySignals.filter(
		signal => signal.range !== undefined && signal.avgRange !== undefined
	)

	return (
		<section className={styles.volatilitySection}>
			<h2 className={styles.sectionTitle}>Volatility Signals</h2>

			{/* Volatility spike signals */}
			{volatilitySpikes.length > 0 && (
				<VolatilityTable
					signals={volatilitySpikes}
					title='Volatility Spikes'
				/>
			)}

			{/* Volatility range signals */}
			{volatilityRanges.length > 0 && (
				<VolatilityTable
					signals={volatilityRanges}
					title='Volatility Ranges'
				/>
			)}

			{/* Volume and price change signals would go here */}
		</section>
	)
}
