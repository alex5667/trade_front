'use client'

import styles from './TopCoinsTable.module.scss'

interface TopCoinsTableProps {
	coins: string[]
	title: string
	isGainer?: boolean
}

export function TopCoinsTable({
	coins,
	title,
	isGainer = true
}: TopCoinsTableProps) {
	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr className={styles.headRow}>
						<th className={styles.cell}>Монета</th>
					</tr>
				</thead>
				<tbody>
					{coins.length > 0 ? (
						coins.map((symbol, idx) => (
							<tr
								key={idx}
								className={styles.row}
							>
								<td className={styles.cell}>{symbol}</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={1}
								className={styles.emptyCell}
							>
								Ожидание данных о {title}...
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
