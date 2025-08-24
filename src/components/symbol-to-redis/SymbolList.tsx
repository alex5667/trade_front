import { useState } from 'react'

import type {
	CreateSymbolToRedisDto,
	SymbolToRedis,
	UpdateSymbolToRedisDto
} from '@/types/symbol-to-redis.types'
import { DEFAULT_TIMEFRAMES } from '@/types/symbol-to-redis.types'

import { SymbolForm } from './SymbolForm'
import styles from './SymbolList.module.scss'
import { SymbolRow } from './SymbolRow'

interface SymbolListProps {
	symbols: SymbolToRedis[]
	onCreate: (data: CreateSymbolToRedisDto) => void
	onUpdate: (id: string, data: UpdateSymbolToRedisDto) => void
	onDelete: (id: string) => void
	isLoading?: boolean
}

export const SymbolList = ({
	symbols,
	onCreate,
	onUpdate,
	onDelete,
	isLoading = false
}: SymbolListProps) => {
	const [showForm, setShowForm] = useState(false)
	const [editingSymbol, setEditingSymbol] = useState<SymbolToRedis | null>(null)

	const handleCreate = (data: CreateSymbolToRedisDto) => {
		onCreate(data)
		setShowForm(false)
	}

	const handleUpdate = (id: string, data: UpdateSymbolToRedisDto) => {
		onUpdate(id, data)
		setEditingSymbol(null)
	}

	const handleDelete = (id: string) => {
		if (window.confirm('Вы уверены, что хотите удалить этот символ?')) {
			onDelete(id)
		}
	}

	const handleEdit = (symbol: SymbolToRedis) => {
		setEditingSymbol(symbol)
	}

	const handleCancelEdit = () => {
		setEditingSymbol(null)
	}

	const handleCancelCreate = () => {
		setShowForm(false)
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>Торговые символы</h2>
				<button
					onClick={() => setShowForm(true)}
					className={styles.addButton}
					disabled={isLoading}
				>
					➕ Добавить символ
				</button>
			</div>

			{/* Форма создания */}
			{showForm && (
				<div className={styles.formOverlay}>
					<SymbolForm
						onSubmit={handleCreate}
						onCancel={handleCancelCreate}
						isLoading={isLoading}
					/>
				</div>
			)}

			{/* Форма редактирования */}
			{editingSymbol && (
				<div className={styles.formOverlay}>
					<SymbolForm
						initialData={{
							symbol: editingSymbol.symbol,
							baseAsset: editingSymbol.baseAsset,
							quoteAsset: editingSymbol.quoteAsset,
							instrumentType: editingSymbol.instrumentType,
							timeframes:
								editingSymbol.timeframes && editingSymbol.timeframes.length > 0
									? editingSymbol.timeframes
									: DEFAULT_TIMEFRAMES,
							exchange: editingSymbol.exchange,
							status: editingSymbol.status || undefined,
							note: editingSymbol.note || undefined
						}}
						onSubmit={data => handleUpdate(editingSymbol.id, data)}
						onCancel={handleCancelEdit}
						isLoading={isLoading}
					/>
				</div>
			)}

			{/* Таблица символов */}
			<div className={styles.tableContainer}>
				<table className={styles.table}>
					<thead className={styles.tableHeader}>
						<tr>
							<th className={styles.headerCell}>Символ</th>
							<th className={styles.headerCell}>Базовая валюта</th>
							<th className={styles.headerCell}>Котируемая валюта</th>
							<th className={styles.headerCell}>Тип</th>
							<th className={styles.headerCell}>Биржа</th>
							<th className={styles.headerCell}>Статус</th>
							<th className={styles.headerCell}>Таймфреймы</th>
							<th className={styles.headerCell}>Примечание</th>
							<th className={styles.headerCell}>Действия</th>
						</tr>
					</thead>
					<tbody className={styles.tableBody}>
						{symbols.length === 0 ? (
							<tr>
								<td
									colSpan={9}
									className={styles.emptyCell}
								>
									{isLoading ? 'Загрузка...' : 'Символы не найдены'}
								</td>
							</tr>
						) : (
							symbols.map(symbol => (
								<SymbolRow
									key={symbol.id}
									symbol={symbol}
									onEdit={handleEdit}
									onDelete={handleDelete}
									isLoading={isLoading}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
