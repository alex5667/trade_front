import { useCallback, useState } from 'react'

import styles from './TelegramSignalsSearch.module.scss'

interface TelegramSignalsSearchProps {
	onSearch: (filters: SearchFilters) => void
	onClear: () => void
}

export interface SearchFilters {
	username?: string
	symbol?: string
	direction?: string
	timeframe?: string
	exchange?: string
}

export const TelegramSignalsSearch = ({
	onSearch,
	onClear
}: TelegramSignalsSearchProps) => {
	const [filters, setFilters] = useState<SearchFilters>({
		username: '',
		symbol: '',
		direction: '',
		timeframe: '',
		exchange: ''
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
		setFilters({
			username: '',
			symbol: '',
			direction: '',
			timeframe: '',
			exchange: ''
		})
		// Сразу отправляем пустой поиск для загрузки всех сигналов
		onClear()
		// И отправляем пустой поиск для загрузки всех сигналов
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
			<div className={styles.searchTitle}>Поиск сигналов</div>

			<div className={styles.searchGrid}>
				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Username</label>
					<input
						type='text'
						value={filters.username}
						onChange={e => handleInputChange('username', e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Введите username'
						className={styles.searchInput}
					/>
				</div>

				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Symbol</label>
					<input
						type='text'
						value={filters.symbol}
						onChange={e => handleInputChange('symbol', e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Введите символ (BTC, ETH, etc.)'
						className={styles.searchInput}
					/>
				</div>

				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Direction</label>
					<select
						value={filters.direction}
						onChange={e => handleInputChange('direction', e.target.value)}
						className={styles.searchInput}
					>
						<option value=''>Все направления</option>
						<option value='long'>Long</option>
						<option value='short'>Short</option>
						<option value='buy'>Buy</option>
						<option value='sell'>Sell</option>
					</select>
				</div>

				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Timeframe</label>
					<input
						type='text'
						value={filters.timeframe}
						onChange={e => handleInputChange('timeframe', e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='1m, 5m, 1h, 4h, 1d'
						className={styles.searchInput}
					/>
				</div>

				<div className={styles.searchField}>
					<label className={styles.searchLabel}>Exchange</label>
					<input
						type='text'
						value={filters.exchange}
						onChange={e => handleInputChange('exchange', e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Binance, Bybit, etc.'
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
