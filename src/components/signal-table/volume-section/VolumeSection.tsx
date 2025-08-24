'use client'

import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectVolumeSignals } from '@/store/signals'

import { FundingTable } from '../funding-table/FundingTable'
import { VolumeSpikeTable } from '../volume-spike-table/VolumeSpikeTable'

import styles from './VolumeSection.module.scss'

export const VolumeSection = () => {
	const volumeSignals = useSelector(selectVolumeSignals)

	// Sort volume signals by volume from highest to lowest
	const sortedVolumeSignals = useMemo(() => {
		if (!volumeSignals || volumeSignals.length === 0) return []

		return [...volumeSignals].sort((a, b) => {
			const volumeA = parseFloat(a.volume) || 0
			const volumeB = parseFloat(b.volume) || 0
			return volumeB - volumeA // Sort from highest to lowest
		})
	}, [volumeSignals])

	return (
		<div>
			<h2 className={styles.sectionTitle}>Volume & Funding</h2>
			<section className={styles.section}>
				<div className={styles.gridTwo}>
					<div>
						<VolumeSpikeTable signals={sortedVolumeSignals} />
					</div>
					<div>
						<FundingTable />
					</div>
				</div>
			</section>
		</div>
	)
}
