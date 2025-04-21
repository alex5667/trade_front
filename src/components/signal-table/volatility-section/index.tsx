'use client'

import { memo } from 'react'

import { VolatilitySpikeSignal } from '@/types/signal.types'

import VolatilityTable from '../volatility-table'

import styles from './volatility-section.module.scss'

type VolatilitySectionProps = {
	volatilitySpikes: VolatilitySpikeSignal[]
	volatilityRanges: VolatilitySpikeSignal[]
}

/**
 * VolatilitySection - Displays volatility-related tables
 */
const VolatilitySection = memo(function VolatilitySection({
	volatilitySpikes,
	volatilityRanges
}: VolatilitySectionProps) {
	return (
		<section className={styles.volatilitySection}>
			<VolatilityTable
				signals={volatilitySpikes}
				title='Волатильность по свече 1м(фильтр 0.8)'
			/>

			<VolatilityTable
				signals={volatilityRanges}
				title='Волатильность в диапазоне 30мин'
			/>
		</section>
	)
})

export default VolatilitySection
