'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { SymbolList } from '@/components/symbol-to-redis/SymbolList'
import SymbolsExcelUploader from '@/components/symbol-to-redis/SymbolsExcelUploader'

import type {
	CreateSymbolToRedisDto,
	UpdateSymbolToRedisDto
} from '@/types/symbol-to-redis.types'

import styles from './page.module.scss'
import {
	useCreateSymbolMutation,
	useDeleteSymbolMutation,
	useGetSymbolsQuery,
	useUpdateSymbolMutation
} from '@/services/symbol-to-redis.api'

export default function SymbolsToRedisPage() {
	const [showExcelUploader, setShowExcelUploader] = useState(false)
	const [filters, setFilters] = useState({
		limit: 100,
		offset: 0,
		field: 'createdAt',
		direction: 'desc' as const
	})

	const {
		data: symbolsResponse,
		isLoading,
		error,
		refetch
	} = useGetSymbolsQuery(filters)
	const [createSymbol, { isLoading: isCreating }] = useCreateSymbolMutation()
	const [updateSymbol, { isLoading: isUpdating }] = useUpdateSymbolMutation()
	const [deleteSymbol, { isLoading: isDeleting }] = useDeleteSymbolMutation()

	const symbols = symbolsResponse?.data || []
	const isLoadingAny = isLoading || isCreating || isUpdating || isDeleting

	const handleCreate = async (data: CreateSymbolToRedisDto) => {
		try {
			await createSymbol(data).unwrap()
			refetch()
			toast.success('Символ успешно создан')
		} catch (error) {
			console.error('Ошибка при создании символа:', error)
			toast.error('Ошибка при создании символа')
		}
	}

	const handleUpdate = async (id: string, data: UpdateSymbolToRedisDto) => {
		try {
			await updateSymbol({ id, data }).unwrap()
			refetch()
			toast.success('Символ успешно обновлен')
		} catch (error) {
			console.error('Ошибка при обновлении символа:', error)
			toast.error('Ошибка при обновлении символа')
		}
	}

	const handleDelete = async (id: string) => {
		try {
			await deleteSymbol(id).unwrap()
			refetch()
			toast.success('Символ успешно удален')
		} catch (error) {
			console.error('Ошибка при удалении символа:', error)
			toast.error('Ошибка при удалении символа')
		}
	}

	if (showExcelUploader) {
		return (
			<div className={styles.container}>
				<div className={styles.headerRow}>
					<h1 className={styles.pageTitle}>Загрузка символов из Excel</h1>
					<button
						onClick={() => setShowExcelUploader(false)}
						className={styles.buttonSecondary}
					>
						← Назад к списку
					</button>
				</div>
				<SymbolsExcelUploader />
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.errorContainer}>
				<h1 className={styles.errorTitle}>Ошибка загрузки</h1>
				<p className={styles.errorMessage}>
					Не удалось загрузить торговые символы. Попробуйте обновить страницу.
				</p>
				<button
					onClick={() => refetch()}
					className={styles.retryButton}
				>
					Повторить
				</button>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.headerRow}>
				<div>
					<h1 className={styles.pageTitle}>Управление торговыми символами</h1>
					<p className={styles.pageDescription}>
						Создавайте, редактируйте и управляйте торговыми символами с
						автоматической синхронизацией в Redis
					</p>
				</div>
				<button
					onClick={() => setShowExcelUploader(true)}
					className={styles.buttonSecondary}
				>
					📊 Загрузить из Excel
				</button>
			</div>

			<SymbolList
				symbols={symbols}
				onCreate={handleCreate}
				onUpdate={handleUpdate}
				onDelete={handleDelete}
				isLoading={isLoadingAny}
			/>

			{/* Статистика */}
			{symbolsResponse && (
				<div className={styles.stats}>
					<div className={styles.statItem}>
						<span className={styles.statLabel}>Всего символов:</span>
						<span className={styles.statValue}>{symbolsResponse.total}</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statLabel}>На странице:</span>
						<span className={styles.statValue}>{symbols.length}</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statLabel}>Страница:</span>
						<span className={styles.statValue}>
							{symbolsResponse.currentPage}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
