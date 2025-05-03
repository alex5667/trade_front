'use client'

import { VolumeSpikeSignal } from '@/types/signal.types'

import styles from './VolumeSpikeTable.module.scss'

interface VolumeSpikeTableProps {
	signals: VolumeSpikeSignal[]
}

export function VolumeSpikeTable({ signals }: VolumeSpikeTableProps) {
	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr className={styles.headRow}>
						<th className={styles.cell}>Монета</th>
						<th className={styles.cell}>Интервал</th>
						<th className={styles.cell}>Объем</th>
						<th className={styles.cell}>Время</th>
					</tr>
				</thead>
				<tbody>
					{signals.length > 0 ? (
						signals.map((signal, idx) => (
							<tr
								key={idx}
								className={styles.row}
							>
								<td className={styles.cell}>{signal.symbol}</td>
								<td className={styles.cell}>{signal.interval}</td>
								<td className={`${styles.cell} ${styles.volumeCell}`}>
									{signal.volume}
								</td>
								<td className={styles.cell}>
									{new Date(signal.timestamp).toLocaleTimeString()}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={4}
								className={styles.emptyCell}
							>
								Ожидание сигналов объема...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
