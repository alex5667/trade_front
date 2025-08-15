'use client'

import { useSelector } from 'react-redux'

import type { VolumeSignalPrisma } from '@/types/signal.types'

import { selectVolumeSignals } from '@/store/signals'

import { FundingTable } from '../funding-table/FundingTable'
import { VolumeSpikeTable } from '../volume-spike-table/VolumeSpikeTable'

import styles from './VolumeSection.module.scss'

export const VolumeSection = () => {
	const volumeSignals = useSelector(selectVolumeSignals)

	// Volume signals are already in VolumeSignalPrisma format from API
	const volumeTableSignals: VolumeSignalPrisma[] = volumeSignals

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
