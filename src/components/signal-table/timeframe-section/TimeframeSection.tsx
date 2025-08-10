'use client'

import { TimeframeCoin } from '@/store/signals/signal.types'

import { TimeframeCoinsTable } from '../timeframe-coins-table/TimeframeCoinsTable'

import styles from './Timeframe-section.module.scss'

interface TimeframeDataProps {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
}

interface TriggerDataProps {
	gainers: string[]
	losers: string[]
}

interface TimeframeSectionProps {
	timeframe: TimeframeDataProps
	triggers: TriggerDataProps
}

/**
 * TimeframeSection - Displays timeframe-related tables
 * (gainers, losers) for 24h timeframe
 */
export const TimeframeSection = ({
	timeframe,
	triggers
}: TimeframeSectionProps) => {
	return (
		<div>
			<h2 className={styles.sectionTitle}>Top by Timeframe</h2>
			<section className={styles.timeframeSection}>
				<div className={styles.gridContainer}>
					<TimeframeCoinsTable
						type='gainers'
						title='Top Gainers'
					/>

					<TimeframeCoinsTable
						type='losers'
						title='Top Losers'
					/>
				</div>
			</section>
		</div>
	)
}
