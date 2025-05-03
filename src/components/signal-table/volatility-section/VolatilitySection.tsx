'use client'

import { memo, useEffect } from 'react'

import { VolatilitySpikeSignal } from '@/types/signal.types'

import { VolatilityTable } from '../volatility-table/VolatilityTable'

import styles from './Volatility-section.module.scss'

type VolatilitySectionProps = {
	volatilitySpikes: VolatilitySpikeSignal[]
	volatilityRanges: VolatilitySpikeSignal[]
}

/**
 * VolatilitySection - Displays volatility-related tables
 */
export const VolatilitySection = memo(function VolatilitySection({
	volatilitySpikes,
	volatilityRanges
}: VolatilitySectionProps) {
	// Мониторим наличие данных по volatility
	useEffect(() => {
		if (volatilitySpikes.length > 0) {
			console.log(
				`VolatilitySection - Received ${volatilitySpikes.length} volatilitySpikes`
			)
		}
		if (volatilityRanges.length > 0) {
			console.log(
				`VolatilitySection - Received ${volatilityRanges.length} volatilityRanges`
			)
		}
	}, [volatilitySpikes, volatilityRanges])

	return (
		<section className={styles.volatilitySection}>
			{/* Таблица сигналов волатильности свечей */}
			<VolatilityTable
				signals={volatilitySpikes}
				title='Волатильность по свече 1м (фильтр 0.8)'
			/>

			{/* Таблица сигналов диапазона волатильности  */}
			<VolatilityTable
				signals={volatilityRanges}
				title='Волатильность в диапазоне 30мин'
			/>
		</section>
	)
})
