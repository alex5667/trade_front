'use client'

import { memo } from 'react'

import { TimeframeCoin } from '@/types/signal.types'

import { TimeframeCoinsTable } from '../timeframe-coins-table/TimeframeCoinsTable'

import styles from './Timeframe-section.module.scss'

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
export const TimeframeSection = memo(function TimeframeSection({
	gainers,
	losers,
	volume,
	funding,
	timeframe
}: TimeframeSectionProps) {
	// Only include title if explicitly needed, it's set on the parent level
	const displayTimeframe = timeframe === '5мин' ? '5мин' : timeframe

	// Debug logging
	console.log(`🔄 TimeframeSection (${displayTimeframe}) received:`, {
		gainers: gainers?.length || 0,
		losers: losers?.length || 0,
		volume: volume?.length || 0,
		funding: funding?.length || 0
	})

	if (gainers?.length > 0) {
		console.log(`✅ Gainers sample for ${displayTimeframe}:`, gainers[0])
	}

	if (losers?.length > 0) {
		console.log(`✅ Losers sample for ${displayTimeframe}:`, losers[0])
	}

	return (
		<section className={styles.timeframeSection}>
			<div className={styles.gridContainer}>
				<TimeframeCoinsTable
					coins={Array.isArray(gainers) ? gainers : []}
					title={`растущих монет (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={true}
				/>

				<TimeframeCoinsTable
					coins={Array.isArray(losers) ? losers : []}
					title={`падающих монет (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={false}
				/>
			</div>
			<div className={styles.gridContainer}>
				<TimeframeCoinsTable
					coins={Array.isArray(volume) ? volume : []}
					title={`объемных монет (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={true}
					isVolume={true}
				/>

				<TimeframeCoinsTable
					coins={Array.isArray(funding) ? funding : []}
					title={`фандинг (${displayTimeframe})`}
					timeframe={displayTimeframe}
					isGainer={true}
					isFunding={true}
				/>
			</div>
		</section>
	)
})
