'use client'

import {
	FundingCoin,
	TimeframeCoin,
	VolumeCoin
} from '@/store/signals/signal.types'

import { TimeframeCoinsTable } from '../timeframe-coins-table/TimeframeCoinsTable'

import styles from './Timeframe-section.module.scss'

interface Timeframe5minData {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
	volume: VolumeCoin[]
	funding: FundingCoin[]
}

interface Timeframe24hData {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
}

interface TriggerData {
	gainers: string[]
	losers: string[]
	volume?: string[]
	funding?: string[]
}

interface TimeframeSectionProps {
	timeframe5min: Timeframe5minData
	timeframe24h: Timeframe24hData
	trigger5min: TriggerData
	trigger24h: TriggerData
}

/**
 * TimeframeSection - Displays all timeframe-related tables
 * (gainers, losers, volume, funding) for 5min and 24h timeframes
 */
export const TimeframeSection = ({
	timeframe5min,
	timeframe24h,
	trigger5min,
	trigger24h
}: TimeframeSectionProps) => {
	return (
		<div>
			<h2 className={styles.sectionTitle}>5-Minute Timeframe</h2>
			<section className={styles.timeframeSection}>
				<div className={styles.gridContainer}>
					<TimeframeCoinsTable
						type='gainers'
						timeframe='5min'
						title='Top Gainers (5min)'
					/>

					<TimeframeCoinsTable
						type='losers'
						timeframe='5min'
						title='Top Losers (5min)'
					/>
				</div>
			</section>

			{timeframe24h.gainers.length > 0 || timeframe24h.losers.length > 0 ? (
				<>
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
				</>
			) : null}
		</div>
	)
}
