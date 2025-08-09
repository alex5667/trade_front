'use client'

import { useSelector } from 'react-redux'

import type { VolumeSpikeSignal } from '@/types/signal.types'

import { selectFundingData, selectVolumeSignals } from '@/store/signals'

import { VolumeSpikeTable } from '../volume-spike-table/VolumeSpikeTable'

import styles from './VolumeSection.module.scss'

export const VolumeSection = () => {
	const volumeSignals = useSelector(selectVolumeSignals)
	const fundingCoins = useSelector(selectFundingData)

	const volumeTableSignals: VolumeSpikeSignal[] = volumeSignals.map(sig => ({
		type: sig.signalType || 'volumeSpike',
		symbol: sig.symbol,
		interval: sig.interval || '',
		volume: sig.volume,
		timestamp: sig.timestamp
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
						{/* Простая таблица funding-коинов */}
						<div className={styles.tableWrapper}>
							<table className={styles.table}>
								<thead>
									<tr>
										<th>Coin</th>
										<th>Funding Rate</th>
									</tr>
								</thead>
								<tbody>
									{fundingCoins && fundingCoins.length > 0 ? (
										fundingCoins.map((c: any, idx: number) => (
											<tr key={idx}>
												<td>{c.symbol || c.coin || '-'}</td>
												<td>
													{typeof c.fundingRate === 'number'
														? c.fundingRate
														: c.rate || '-'}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={2}>Нет данных по funding...</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
