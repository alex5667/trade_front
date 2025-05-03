'use client'

import { useEffect, useRef, useState } from 'react'

import styles from './TriggerCoinsTable.module.scss'

interface TriggerCoinsTableProps {
	coins: string[]
	title: string
	timeframe: string
	isGainer: boolean
}

interface EnhancedCoin {
	symbol: string
	highlight: boolean
}

export function TriggerCoinsTable({
	coins,
	title,
	timeframe,
	isGainer
}: TriggerCoinsTableProps) {
	const [uniqueCoins, setUniqueCoins] = useState<EnhancedCoin[]>([])
	const prevCoinsRef = useRef<string[]>([])

	useEffect(() => {
		const prevSet = new Set(prevCoinsRef.current)
		const enhanced = coins.map(symbol => ({
			symbol,
			highlight: !prevSet.has(symbol)
		}))
		setUniqueCoins(enhanced)
		prevCoinsRef.current = coins

		const timer = setTimeout(() => {
			setUniqueCoins(prev => prev.map(c => ({ ...c, highlight: false })))
		}, 1000)
		return () => clearTimeout(timer)
	}, [coins])

	const colorClass = isGainer ? styles.positive : styles.negative

	return (
		<div className={styles.tableWrapper}>
			<h3 className={styles.tableHeader}>
				{isGainer ? 'Растущие' : 'Падающие'} монеты ({timeframe})
			</h3>
			<table className={styles.table}>
				<thead>
					<tr className={styles.tableHeaderRow}>
						<th className={styles.cell}>Монета</th>
					</tr>
				</thead>
				<tbody>
					{uniqueCoins.length > 0 ? (
						uniqueCoins.map(coin => {
							const rowClass = coin.highlight
								? `${styles.row} ${styles.highlight}`
								: styles.row

							return (
								<tr
									key={coin.symbol}
									className={rowClass}
								>
									<td className={`${styles.symbolCell} ${colorClass}`}>
										{coin.symbol}
									</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={1}
								className={styles.emptyCell}
							>
								Ожидание сигналов {title}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
