'use client'

import { useMemo } from 'react'
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

	const sortedFunding = useMemo(() => {
		const list = (fundingCoins || []).map((c: any) => ({
			symbol: c.symbol || c.coin || '-',
			rate: typeof c.fundingRate === 'number' ? c.fundingRate : c.rate
		}))
		// sort by absolute rate desc
		return list.sort((a, b) => Math.abs(b.rate || 0) - Math.abs(a.rate || 0))
	}, [fundingCoins])

	const formatRate = (rate?: number) => {
		if (rate === undefined || rate === null || isNaN(rate)) return '-'
		const sign = rate > 0 ? '+' : rate < 0 ? '−' : ''
		return `${sign}${(rate * 100).toFixed(3)}%`
	}

	return (
		<div>
			<h2 className={styles.sectionTitle}>Volume & Funding</h2>
			<section className={styles.section}>
				<div className={styles.gridTwo}>
					<div>
						<VolumeSpikeTable signals={volumeTableSignals} />
					</div>
					<div>
						<div className={styles.tableWrapper}>
							<table className={styles.table}>
								<thead>
									<tr className={styles.headRow}>
										<th className={styles.cell}>Coin</th>
										<th className={styles.cell}>Funding Rate</th>
									</tr>
								</thead>
								<tbody>
									{sortedFunding && sortedFunding.length > 0 ? (
										sortedFunding.map((c: any, idx: number) => {
											const rate = c.rate as number | undefined
											const cls =
												rate && rate !== 0
													? rate > 0
														? styles.positive
														: styles.negative
													: ''
											return (
												<tr
													key={idx}
													className={styles.row}
												>
													<td className={styles.cell}>{c.symbol}</td>
													<td
														className={`${styles.cell} ${styles.rateCell} ${cls}`}
													>
														{formatRate(rate)}
													</td>
												</tr>
											)
										})
									) : (
										<tr>
											<td
												colSpan={2}
												className={styles.emptyCell}
											>
												Нет данных по funding...
											</td>
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
