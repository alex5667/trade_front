import tableStyles from '@/components/signal-table/volume-spike-table/VolumeSpikeTable.module.scss'

interface TelegramSignalsTableProps {
	columns: string[]
	signals: any[]
	onOpenDetails: (row: any, ev: React.MouseEvent<HTMLButtonElement>) => void
	isLoading: boolean
	isError: boolean
	onRefetch: () => void
}

export const TelegramSignalsTable = ({
	columns,
	signals,
	onOpenDetails,
	isLoading,
	isError,
	onRefetch
}: TelegramSignalsTableProps) => {
	const hasData = signals.length > 0
	return (
		<div className={tableStyles.tableWrapper}>
			<table className={tableStyles.table}>
				<thead>
					<tr className={tableStyles.headRow}>
						<th className={tableStyles.cell}></th>
						{columns.map(col => (
							<th
								key={col}
								className={tableStyles.cell}
							>
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{isLoading ? (
						<tr>
							<td
								colSpan={columns.length + 1}
								className={tableStyles.emptyCell}
							>
								Загрузка...
							</td>
						</tr>
					) : isError ? (
						<tr>
							<td
								colSpan={columns.length + 1}
								className={tableStyles.emptyCell}
							>
								Ошибка загрузки.{' '}
								<button
									className='underline'
									onClick={onRefetch}
								>
									Повторить
								</button>
							</td>
						</tr>
					) : hasData ? (
						signals.map((s: any, idx: number) => {
							const rowKey = s?.messageId ?? s?.id ?? idx
							return (
								<tr
									key={rowKey}
									className={tableStyles.row}
								>
									<td className={tableStyles.cell}>
										<button
											onClick={ev => onOpenDetails(s, ev)}
											className='px-2 py-1 border rounded'
											aria-label='Подробнее'
											title='Развернуть'
										>
											+
										</button>
									</td>
									{columns.map(col => (
										<td
											key={col}
											className={tableStyles.cell}
										>
											{s?.[col] === undefined || s?.[col] === null
												? '-'
												: String(s?.[col])}
										</td>
									))}
								</tr>
							)
						})
					) : (
						<tr>
							<td
								colSpan={columns.length + 1}
								className={tableStyles.emptyCell}
							>
								Нет сигналов
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
