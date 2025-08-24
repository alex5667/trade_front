import type { SymbolToRedis } from '@/types/symbol-to-redis.types'

import styles from './SymbolRow.module.scss'

interface SymbolRowProps {
	symbol: SymbolToRedis
	onEdit: (symbol: SymbolToRedis) => void
	onDelete: (id: string) => void
	isLoading?: boolean
}

export const SymbolRow = ({
	symbol,
	onEdit,
	onDelete,
	isLoading
}: SymbolRowProps) => {
	const formatTimeframes = (timeframes?: SymbolToRedis['timeframes']) => {
		if (!timeframes || timeframes.length === 0) return '-'
		return timeframes.join(', ')
	}

	const formatDate = (date: Date | string) => {
		return new Date(date).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<tr className={styles.row}>
			<td className={styles.cell}>
				<span className={styles.symbol}>{symbol.symbol}</span>
			</td>
			<td className={styles.cell}>{symbol.baseAsset}</td>
			<td className={styles.cell}>{symbol.quoteAsset}</td>
			<td className={styles.cell}>
				<span className={styles.instrumentType}>{symbol.instrumentType}</span>
			</td>
			<td className={styles.cell}>{symbol.exchange}</td>
			<td className={styles.cell}>
				<span className={styles.status}>{symbol.status || '-'}</span>
			</td>
			<td className={styles.cell}>
				<span className={styles.timeframes}>
					{formatTimeframes(symbol.timeframes)}
				</span>
			</td>
			<td className={styles.cell}>
				<span
					className={styles.note}
					title={symbol.note || ''}
				>
					{symbol.note || '-'}
				</span>
			</td>
			<td className={styles.cell}>
				<div className={styles.actions}>
					<button
						onClick={() => onEdit(symbol)}
						disabled={isLoading}
						className={styles.editButton}
						title='Редактировать'
					>
						✏️
					</button>
					<button
						onClick={() => onDelete(symbol.id)}
						disabled={isLoading}
						className={styles.deleteButton}
						title='Удалить'
					>
						🗑️
					</button>
				</div>
			</td>
		</tr>
	)
}
