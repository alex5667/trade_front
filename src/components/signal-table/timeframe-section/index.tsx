'use client'

import { memo } from 'react'

import { TimeframeCoin } from '@/types/signal.types'

import TimeframeCoinsTable from '../timeframe-coins-table'

import styles from './timeframe-section.module.scss'

type TimeframeSectionProps = {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
	volume: TimeframeCoin[]
	funding: TimeframeCoin[]
	timeframe: string
}

/**
 * TimeframeSection - Displays all timeframe-related tables
 * (gainers, losers, volume, funding) for a specific timeframe
 */
const TimeframeSection = memo(function TimeframeSection({
	gainers,
	losers,
	volume,
	funding,
	timeframe
}: TimeframeSectionProps) {
	// Only include title if explicitly needed, it's set on the parent level
	const displayTimeframe = timeframe === '5мин' ? '5мин' : timeframe

	return (
		<section className={styles.timeframeSection}>
			<div className={styles.gridContainer}>
				<TimeframeCoinsTable
					coins={gainers}
					title={`растущих монет (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={true}
				/>

				<TimeframeCoinsTable
					coins={losers}
					title={`падающих монет (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={false}
				/>
			</div>
			<div className={styles.gridContainer}>
				<TimeframeCoinsTable
					coins={volume}
					title={`объемных монет (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={true}
					isVolume={true}
				/>

				<TimeframeCoinsTable
					coins={funding}
					title={`фандинг (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={true}
					isFunding={true}
				/>
			</div>
		</section>
	)
})

export default TimeframeSection
