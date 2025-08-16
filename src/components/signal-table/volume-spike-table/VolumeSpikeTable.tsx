'use client'

import { VolumeSignalPrisma } from '@/types/signal.types'

import styles from './VolumeSpikeTable.module.scss'

interface VolumeSpikeTableProps {
	signals: VolumeSignalPrisma[]
}

export function VolumeSpikeTable({ signals }: VolumeSpikeTableProps) {
	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr className={styles.headRow}>
						<th className={styles.cell}>Монета</th>
						<th className={`${styles.cell} ${styles.center}`}>Объем (Quote)</th>
						<th className={`${styles.cell} ${styles.center}`}>Дата/Время</th>
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
								<td
									className={`${styles.cell} ${styles.volumeCell} ${styles.center}`}
								>
									{signal.volume}
								</td>
								<td className={`${styles.cell} ${styles.center}`}>
									{signal.timestamp
										? new Date(signal.timestamp).toLocaleString('ru-RU', {
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
												second: '2-digit'
											})
										: '-'}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={3}
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
