import { useMemo, useState } from 'react'

import tableStyles from '@/components/signal-table/volume-spike-table/VolumeSpikeTable.module.scss'

import styles from './TelegramSignalsTable.module.scss'
import { formatCell } from './formatters'

interface TelegramSignalsTableProps {
	columns: string[]
	signals: any[]
	onOpenDetails: (row: any, ev: React.MouseEvent<HTMLButtonElement>) => void
	isLoading: boolean
	isError: boolean
	onRefetch: () => void
}

type SortDirection = 'asc' | 'desc' | null

interface SortState {
	column: string | null
	direction: SortDirection
}

export const TelegramSignalsTable = ({
	columns,
	signals,
	onOpenDetails,
	isLoading,
	isError,
	onRefetch
}: TelegramSignalsTableProps) => {
	const [sortState, setSortState] = useState<SortState>({
		column: null,
		direction: null
	})

	const handleSort = (column: string) => {
		setSortState(prev => {
			if (prev.column === column) {
				// Переключаем направление сортировки
				if (prev.direction === 'asc') return { column, direction: 'desc' }
				if (prev.direction === 'desc') return { column, direction: null }
				return { column, direction: 'asc' }
			}
			// Новая колонка - начинаем с возрастания
			return { column, direction: 'asc' }
		})
	}

	const sortedSignals = useMemo(() => {
		if (!sortState.column || !sortState.direction) return signals

		return [...signals].sort((a, b) => {
			const aValue = a[sortState.column!]
			const bValue = b[sortState.column!]

			// Обработка null/undefined значений
			if (aValue == null && bValue == null) return 0
			if (aValue == null) return 1
			if (bValue == null) return -1

			// Попытка числовой сортировки
			const aNum = Number(aValue)
			const bNum = Number(bValue)
			if (!isNaN(aNum) && !isNaN(bNum)) {
				return sortState.direction === 'asc' ? aNum - bNum : bNum - aNum
			}

			// Строковая сортировка
			const aStr = String(aValue).toLowerCase()
			const bStr = String(bValue).toLowerCase()
			if (sortState.direction === 'asc') {
				return aStr.localeCompare(bStr)
			} else {
				return bStr.localeCompare(aStr)
			}
		})
	}, [signals, sortState])

	const getSortIcon = (column: string) => {
		if (sortState.column !== column) return '↕️'
		if (sortState.direction === 'asc') return '↑'
		if (sortState.direction === 'desc') return '↓'
		return '↕️'
	}

	const hasData = sortedSignals.length > 0
	return (
		<div className={tableStyles.tableWrapper}>
			<table className={tableStyles.table}>
				<thead>
					<tr className={tableStyles.headRow}>
						<th className={tableStyles.cell}></th>
						{columns.map(col => (
							<th
								key={col}
								className={`${tableStyles.cell} ${styles.sortableHeader}`}
								onClick={() => handleSort(col)}
								title={`Сортировать по ${col}`}
							>
								<div className={styles.headerContent}>
									<span>{col}</span>
									<span className={styles.sortIcon}>{getSortIcon(col)}</span>
								</div>
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
									className={styles.refetchLink}
									onClick={onRefetch}
								>
									Повторить
								</button>
							</td>
						</tr>
					) : hasData ? (
						sortedSignals.map((s: any, idx: number) => {
							const rowKey = s?.messageId ?? s?.id ?? idx
							return (
								<tr
									key={rowKey}
									className={tableStyles.row}
								>
									<td className={tableStyles.cell}>
										<button
											onClick={ev => onOpenDetails(s, ev)}
											className={styles.expandBtn}
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
											{formatCell(col, s?.[col])}
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
