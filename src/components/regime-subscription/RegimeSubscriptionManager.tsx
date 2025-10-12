/**
 * Компонент для управления подписками на Market Regime
 * ------------------------------
 * Позволяет пользователю выбирать символы и таймфреймы для отслеживания
 * рыночных режимов в реальном времени через WebSocket
 */
'use client'

import { useEffect, useState } from 'react'

import { useRegimeSocketSubscription } from '@/hooks/useRegimeSocketSubscription'

import styles from './RegimeSubscriptionManager.module.scss'

/**
 * Компонент для управления подписками на Market Regime
 * ------------------------------
 * Позволяет пользователю выбирать символы и таймфреймы для отслеживания
 * рыночных режимов в реальном времени через WebSocket
 */

/**
 * Доступные таймфреймы
 */
const AVAILABLE_TIMEFRAMES = [
	{ value: 'M1', label: '1m' },
	{ value: 'M5', label: '5m' },
	{ value: 'M15', label: '15m' },
	{ value: 'M30', label: '30m' },
	{ value: 'H1', label: '1h' },
	{ value: 'H4', label: '4h' },
	{ value: 'D1', label: '1d' }
]

/**
 * Популярные символы (можно расширить или получать из API)
 */
const POPULAR_SYMBOLS = [
	'BTCUSDT',
	'ETHUSDT',
	'BNBUSDT',
	'SOLUSDT',
	'ADAUSDT',
	'DOGEUSDT',
	'XRPUSDT',
	'DOTUSDT',
	'MATICUSDT',
	'AVAXUSDT'
]

interface RegimeSubscriptionManagerProps {
	/** Callback при изменении режима */
	onRegimeUpdate?: (symbol: string, timeframe: string, regime: any) => void
	/** Показывать ли детальную информацию */
	showDetails?: boolean
}

export const RegimeSubscriptionManager: React.FC<
	RegimeSubscriptionManagerProps
> = ({ onRegimeUpdate, showDetails = false }) => {
	const { regimes, isConnected, subscription, subscribe, unsubscribe, error } =
		useRegimeSocketSubscription()

	const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['BTCUSDT'])
	const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([
		'M15',
		'H4'
	])
	const [customSymbol, setCustomSymbol] = useState('')

	/**
	 * Применить подписку
	 */
	const handleApplySubscription = () => {
		if (selectedSymbols.length === 0) {
			alert('Выберите хотя бы один символ')
			return
		}
		if (selectedTimeframes.length === 0) {
			alert('Выберите хотя бы один таймфрейм')
			return
		}
		subscribe(selectedSymbols, selectedTimeframes)
	}

	/**
	 * Переключение символа
	 */
	const toggleSymbol = (symbol: string) => {
		setSelectedSymbols(prev => {
			if (prev.includes(symbol)) {
				return prev.filter(s => s !== symbol)
			}
			return [...prev, symbol]
		})
	}

	/**
	 * Переключение таймфрейма
	 */
	const toggleTimeframe = (timeframe: string) => {
		setSelectedTimeframes(prev => {
			if (prev.includes(timeframe)) {
				return prev.filter(tf => tf !== timeframe)
			}
			return [...prev, timeframe]
		})
	}

	/**
	 * Добавить кастомный символ
	 */
	const handleAddCustomSymbol = () => {
		const symbol = customSymbol.trim().toUpperCase()
		if (symbol && !selectedSymbols.includes(symbol)) {
			setSelectedSymbols(prev => [...prev, symbol])
			setCustomSymbol('')
		}
	}

	/**
	 * Удалить символ
	 */
	const handleRemoveSymbol = (symbol: string) => {
		setSelectedSymbols(prev => prev.filter(s => s !== symbol))
	}

	/**
	 * Уведомление о новых обновлениях
	 */
	useEffect(() => {
		if (onRegimeUpdate) {
			regimes.forEach((regime, key) => {
				const [symbol, timeframe] = key.split(':')
				onRegimeUpdate(symbol, timeframe, regime)
			})
		}
	}, [regimes, onRegimeUpdate])

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3>Управление подписками на режимы</h3>
				<div className={styles.status}>
					<span
						className={isConnected ? styles.connected : styles.disconnected}
					>
						{isConnected ? '🟢 Подключено' : '🔴 Отключено'}
					</span>
				</div>
			</div>

			{error && <div className={styles.error}>⚠️ Ошибка: {error}</div>}

			{/* Выбор символов */}
			<div className={styles.section}>
				<h4>Символы</h4>
				<div className={styles.symbolsGrid}>
					{POPULAR_SYMBOLS.map(symbol => (
						<button
							key={symbol}
							className={`${styles.symbolButton} ${
								selectedSymbols.includes(symbol) ? styles.active : ''
							}`}
							onClick={() => toggleSymbol(symbol)}
						>
							{symbol}
						</button>
					))}
				</div>

				<div className={styles.customSymbol}>
					<input
						type='text'
						value={customSymbol}
						onChange={e => setCustomSymbol(e.target.value)}
						placeholder='Добавить символ (например, LINKUSDT)'
						className={styles.input}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								handleAddCustomSymbol()
							}
						}}
					/>
					<button
						onClick={handleAddCustomSymbol}
						className={styles.addButton}
					>
						Добавить
					</button>
				</div>

				{selectedSymbols.length > 0 && (
					<div className={styles.selectedSymbols}>
						<span>Выбрано:</span>
						{selectedSymbols.map(symbol => (
							<span
								key={symbol}
								className={styles.tag}
							>
								{symbol}
								<button
									onClick={() => handleRemoveSymbol(symbol)}
									className={styles.removeButton}
								>
									×
								</button>
							</span>
						))}
					</div>
				)}
			</div>

			{/* Выбор таймфреймов */}
			<div className={styles.section}>
				<h4>Таймфреймы</h4>
				<div className={styles.timeframesGrid}>
					{AVAILABLE_TIMEFRAMES.map(tf => (
						<button
							key={tf.value}
							className={`${styles.timeframeButton} ${
								selectedTimeframes.includes(tf.value) ? styles.active : ''
							}`}
							onClick={() => toggleTimeframe(tf.value)}
						>
							{tf.label}
						</button>
					))}
				</div>
			</div>

			{/* Кнопки управления */}
			<div className={styles.actions}>
				<button
					onClick={handleApplySubscription}
					className={styles.applyButton}
					disabled={
						!isConnected ||
						selectedSymbols.length === 0 ||
						selectedTimeframes.length === 0
					}
				>
					Применить подписку
					{selectedSymbols.length > 0 && selectedTimeframes.length > 0 && (
						<span className={styles.count}>
							({selectedSymbols.length} × {selectedTimeframes.length} ={' '}
							{selectedSymbols.length * selectedTimeframes.length})
						</span>
					)}
				</button>
				<button
					onClick={unsubscribe}
					className={styles.clearButton}
					disabled={!isConnected}
				>
					Отменить подписку
				</button>
			</div>

			{/* Текущая подписка */}
			{subscription && (
				<div className={styles.currentSubscription}>
					<h4>Текущая подписка</h4>
					<div className={styles.subscriptionInfo}>
						<div>
							<strong>Символы:</strong> {subscription.symbols.join(', ')}
						</div>
						<div>
							<strong>Таймфреймы:</strong> {subscription.timeframes.join(', ')}
						</div>
						<div>
							<strong>Всего комбинаций:</strong>{' '}
							{subscription.symbols.length * subscription.timeframes.length}
						</div>
					</div>
				</div>
			)}

			{/* Список режимов (если showDetails) */}
			{showDetails && regimes.size > 0 && (
				<div className={styles.regimesList}>
					<h4>Полученные режимы ({regimes.size})</h4>
					<div className={styles.regimesGrid}>
						{Array.from(regimes.entries()).map(([key, regime]) => (
							<div
								key={key}
								className={styles.regimeCard}
							>
								<div className={styles.regimeHeader}>
									<strong>{regime.symbol}</strong>
									<span className={styles.timeframe}>{regime.timeframe}</span>
								</div>
								<div className={styles.regimeValue}>
									<span
										className={`${styles.regime} ${styles[regime.regime?.toLowerCase() || '']}`}
									>
										{regime.regime}
									</span>
								</div>
								<div className={styles.regimeDetails}>
									<div>ADX: {regime.adx?.toFixed(2)}</div>
									<div>ATR%: {regime.atrPct?.toFixed(3)}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
