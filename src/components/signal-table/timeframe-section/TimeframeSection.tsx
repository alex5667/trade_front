'use client'

import { TimeframeCoin } from '@/store/signals/signal.types'

import { TimeframeCoinsTable } from '../timeframe-coins-table/TimeframeCoinsTable'

import styles from './Timeframe-section.module.scss'

interface Timeframe24hData {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
}

interface TriggerData {
	gainers: string[]
	losers: string[]
}

interface TimeframeSectionProps {
	timeframe24h: Timeframe24hData
	trigger24h: TriggerData
}

/**
 * TimeframeSection - Displays timeframe-related tables
 * (gainers, losers) for 24h timeframe
 */
export const TimeframeSection = ({
	timeframe24h,
	trigger24h
}: TimeframeSectionProps) => {
	return (
		<div>
			<h2 className={styles.sectionTitle}>24-Hour Timeframe</h2>
			<section className={styles.timeframeSection}>
				<div className={styles.gridContainer}>
					<TimeframeCoinsTable
						type='gainers'
						timeframe='24h'
						title='Top Gainers (24h)'
					/>

					<TimeframeCoinsTable
						type='losers'
						timeframe='24h'
						title='Top Losers (24h)'
					/>
				</div>
			</section>
		</div>
	)
}
