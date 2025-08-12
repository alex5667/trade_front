'use client'

import { useSelector } from 'react-redux'

import type { VolumeSpikeSignal } from '@/types/signal.types'

import { selectVolumeSignals } from '@/store/signals'

import { FundingTable } from '../funding-table/FundingTable'
import { VolumeSpikeTable } from '../volume-spike-table/VolumeSpikeTable'

import styles from './VolumeSection.module.scss'

export const VolumeSection = () => {
	const volumeSignals = useSelector(selectVolumeSignals)

	const volumeTableSignals: VolumeSpikeSignal[] = volumeSignals.map(sig => ({
		type: 'volumeSpike',
		symbol: sig.symbol,
		interval: (sig as any).timeframe || '',
		volume: sig.volume,
		timestamp:
			typeof sig.timestamp === 'string'
				? Date.parse(sig.timestamp)
				: sig.timestamp
	}))

	return (
		<div>
			<h2 className={styles.sectionTitle}>Volume & Funding</h2>
			<section className={styles.section}>
				<div className={styles.gridTwo}>
					<div>
						<VolumeSpikeTable signals={volumeTableSignals} />
					</div>
					<div>
						<FundingTable />
					</div>
				</div>
			</section>
		</div>
	)
}
