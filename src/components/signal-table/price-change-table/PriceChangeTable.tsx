'use client'

import { PriceChangeSignal } from '@/types/signal.types'

import styles from './PriceChangeTable.module.scss'

interface PriceChangeTableProps {
	signals: PriceChangeSignal[]
}

export function PriceChangeTable({ signals }: PriceChangeTableProps) {
	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr className={styles.headerRow}>
						<th className={styles.cell}>Монета</th>
						<th className={styles.cell}>Интервал</th>
						<th className={styles.cell}>Изменение цены</th>
						<th className={styles.cell}>Процент</th>
						<th className={styles.cell}>Время</th>
					</tr>
				</thead>
				<tbody>
					{signals.length > 0 ? (
						signals.map((signal, idx) => {
							const ChangeClass =
								signal.priceChangePercent >= 0
									? styles.positive
									: styles.negative

							return (
								<tr
									key={idx}
									className={styles.row}
								>
									<td className={styles.cell}>{signal.symbol}</td>
									<td className={styles.cell}>{signal.interval}</td>
									<td className={styles.cell}>{signal.priceChange}</td>
									<td className={`${styles.cell} ${ChangeClass}`}>
										{signal.priceChangePercent >= 0 ? '+' : ''}
										{signal.priceChangePercent}%
									</td>
									<td className={styles.cell}>
										{new Date(signal.timestamp).toLocaleTimeString()}
									</td>
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={5}
								className={styles.emptyCell}
							>
								Ожидание сигналов изменения цены...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
