import { useCallback, useState } from 'react'

import styles from './Channel.module.scss'

interface TelegramChannelSearchProps {
	onSearch: (filters: SearchFilters) => void
	onClear: () => void
}

export interface SearchFilters {
	titleContains?: string
	usernameContains?: string
	linkContains?: string
}

export const TelegramChannelSearch = ({
	onSearch,
	onClear
}: TelegramChannelSearchProps) => {
	const [filters, setFilters] = useState<SearchFilters>({
		titleContains: '',
		usernameContains: '',
		linkContains: ''
	})

	const handleInputChange = useCallback(
		(field: keyof SearchFilters, value: string) => {
			setFilters(prev => ({
				...prev,
				[field]: value
			}))
		},
		[]
	)

	const handleSearch = useCallback(() => {
		// Убираем пустые поля
		const activeFilters = Object.fromEntries(
			Object.entries(filters).filter(
				([_, value]) => value && value.trim() !== ''
			)
		)
		onSearch(activeFilters)
	}, [filters, onSearch])

	const handleClear = useCallback(() => {
		// Сначала очищаем локальное состояние
		setFilters({
			titleContains: '',
			usernameContains: '',
			linkContains: ''
		})
		// Затем вызываем очистку в родительском компоненте
		onClear()
		// И отправляем пустой поиск для загрузки всех каналов
		onSearch({})
	}, [onSearch, onClear])

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				handleSearch()
			}
		},
		[handleSearch]
	)

	return (
		<div className={styles.searchContainer}>
			<div className={styles.searchTitle}>Поиск и фильтрация</div>

			<div className={styles.searchGrid}>
				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Название (содержит)</label>
					<input
						type='text'
						value={filters.titleContains}
						onChange={e => handleInputChange('titleContains', e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Введите часть названия'
						className={styles.searchInput}
					/>
				</div>

				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Username (содержит)</label>
					<input
						type='text'
						value={filters.usernameContains}
						onChange={e =>
							handleInputChange('usernameContains', e.target.value)
						}
						onKeyPress={handleKeyPress}
						placeholder='Введите часть username'
						className={styles.searchInput}
					/>
				</div>

				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Ссылка (содержит)</label>
					<input
						type='text'
						value={filters.linkContains}
						onChange={e => handleInputChange('linkContains', e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Введите часть ссылки'
						className={styles.searchInput}
					/>
				</div>
			</div>

			<div className={styles.searchActions}>
				<button
					onClick={handleSearch}
					className={styles.searchButton}
					title='Выполнить поиск'
				>
					🔍 Поиск
				</button>
				<button
					onClick={handleClear}
					className={styles.clearButton}
					title='Очистить фильтры'
				>
					🗑️ Очистить
				</button>
			</div>
		</div>
	)
}
