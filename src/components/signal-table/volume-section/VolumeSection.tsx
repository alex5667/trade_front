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
		type: 'volumeSpike',
		symbol: sig.symbol,
		interval: (sig as any).timeframe || '',
		volume: sig.volume,
		timestamp:
			typeof sig.timestamp === 'string'
				? Date.parse(sig.timestamp)
				: sig.timestamp
	}))

	const sortedFunding = useMemo(() => {
		const list = (fundingCoins || []).map((c: any) => ({
			// Preserve all known fields from FundingCoin/BaseSignal
			symbol: c.symbol || c.coin || '-',
			rate: typeof c.fundingRate === 'number' ? c.fundingRate : c.rate,
			interval: c.interval || c.fundingInterval || '-',
			nextFundingTime: c.nextFundingTime || c.nextFunding || c.nextFundingAt,
			exchange: c.exchange || '-',
			price: c.price,
			timestamp: c.timestamp
		}))
		return list.sort((a, b) => Math.abs(b.rate || 0) - Math.abs(a.rate || 0))
	}, [fundingCoins])

	const formatRate = (rate?: number) => {
		if (rate === undefined || rate === null || isNaN(rate)) return '-'
		const sign = rate > 0 ? '+' : rate < 0 ? '−' : ''
		return `${sign}${(rate * 100).toFixed(3)}%`
	}

	const formatTime = (value?: number) => {
		if (!value || Number.isNaN(value)) return '-'
		try {
			return new Date(value).toLocaleTimeString()
		} catch (_) {
			return '-'
		}
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
										<th className={styles.cell}>Interval</th>
										<th className={styles.cell}>Next Funding</th>
										<th className={styles.cell}>Exchange</th>
										<th className={styles.cell}>Price</th>
										<th className={styles.cell}>Time</th>
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
													<td className={styles.cell}>{c.interval || '-'}</td>
													<td className={styles.cell}>
														{formatTime(c.nextFundingTime)}
													</td>
													<td className={styles.cell}>{c.exchange || '-'}</td>
													<td className={styles.cell}>{c.price ?? '-'}</td>
													<td className={styles.cell}>
														{formatTime(c.timestamp)}
													</td>
												</tr>
											)
										})
									) : (
										<tr>
											<td
												colSpan={7}
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
