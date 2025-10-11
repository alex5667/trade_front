'use client'

import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectFundingData } from '@/store/signals'

import tableStyles from '../volume-spike-table/VolumeSpikeTable.module.scss'

export const FundingTable = () => {
	const fundingCoins = useSelector(selectFundingData)

	const sortedFunding = useMemo(() => {
		const list = (fundingCoins || []).map((c: any) => ({
			symbol: c.symbol || c.coin || '',
			rate: typeof c.fundingRate === 'number' ? c.fundingRate : c.rate,
			interval: c.interval || c.fundingInterval || '',
			nextFundingTime: c.nextFundingTime || c.nextFunding || c.nextFundingAt,
			exchange: c.exchange || '',
			price: c.price,
			timestamp: c.timestamp
		}))
		return list.sort((a, b) => Math.abs(b.rate || 0) - Math.abs(a.rate || 0))
	}, [fundingCoins])

	// Debug logging to track data and detect duplicates
	useEffect(() => {
		if (sortedFunding.length > 0) {
			const symbols = sortedFunding.map(coin => coin.symbol)
			const uniqueSymbols = new Set(symbols)
			if (symbols.length !== uniqueSymbols.size) {
				console.warn(`⚠️ Duplicate symbols detected in funding table:`, {
					total: symbols.length,
					unique: uniqueSymbols.size,
					duplicates: symbols.filter(
						(symbol, index) => symbols.indexOf(symbol) !== index
					)
				})
			} else {
				console.log(`✅ Funding table: ${sortedFunding.length} unique symbols`)
			}
		}
	}, [sortedFunding])

	const formatRate = (rate?: number) => {
		if (rate === undefined || rate === null || isNaN(rate)) return ''
		return `${(Number(rate) * 100).toFixed(3)}%`
	}

	const formatTime = (value?: number) => {
		if (!value || Number.isNaN(value)) return ''
		try {
			return new Date(value).toLocaleString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			})
		} catch (_) {
			return ''
		}
	}

	return (
		<div className={tableStyles.tableWrapper}>
			<table className={tableStyles.table}>
				<thead>
					<tr className={tableStyles.headRow}>
						<th className={tableStyles.cell}>Монета</th>
						<th className={`${tableStyles.cell} ${tableStyles.center}`}>
							Rate
						</th>
						<th className={`${tableStyles.cell} ${tableStyles.center}`}>
							Дата/Время
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedFunding && sortedFunding.length > 0 ? (
						sortedFunding.map((c: any, idx: number) => (
							<tr
								key={`${c.symbol}-${c.timestamp ?? idx}`}
								className={tableStyles.row}
							>
								<td className={tableStyles.cell}>{c.symbol}</td>
								<td className={`${tableStyles.cell} ${tableStyles.center}`}>
									{formatRate(c.rate)}
								</td>
								<td className={`${tableStyles.cell} ${tableStyles.center}`}>
									{formatTime(c.timestamp)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={3}
								className={tableStyles.emptyCell}
							>
								Нет данных по funding...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
