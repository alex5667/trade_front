/**
 * Regime Subscriptions Dashboard
 * ------------------------------
 * Полноценный дашборд с мониторингом рыночного режима,
 * здоровья пайплайна и контекстом для принятия решений.
 * ИСТОЧНИК ДАННЫХ: WebSocket подписки (множественные символы/таймфреймы)
 */
'use client'

import { useEffect, useState } from 'react'

import { RegimeWidget } from '@/components/regime-badge'
import { RegimeContext } from '@/components/regime-context'
import { RegimeHealth } from '@/components/regime-health'

import { useRegimeSocketSubscription } from '@/hooks/useRegimeSocketSubscription'

import styles from './RegimeSubscriptions.module.scss'

/**
 * Regime Subscriptions Dashboard
 * ------------------------------
 * Полноценный дашборд с мониторингом рыночного режима,
 * здоровья пайплайна и контекстом для принятия решений.
 * ИСТОЧНИК ДАННЫХ: WebSocket подписки (множественные символы/таймфреймы)
 */

/**
 * Regime Subscriptions Dashboard
 * ------------------------------
 * Полноценный дашборд с мониторингом рыночного режима,
 * здоровья пайплайна и контекстом для принятия решений.
 * ИСТОЧНИК ДАННЫХ: WebSocket подписки (множественные символы/таймфреймы)
 */

const POPULAR_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT']

const AVAILABLE_TIMEFRAMES = [
	{ value: '1m', label: '1m' },
	{ value: '5m', label: '5m' },
	{ value: '15m', label: '15m' },
	{ value: '1h', label: '1h' },
	{ value: '4h', label: '4h' }
]

interface SymbolConfig {
	symbol: string
	ltf: string
	htf: string
}

export default function RegimeSubscriptionsPage() {
	const [symbolConfigs, setSymbolConfigs] = useState<SymbolConfig[]>([
		{ symbol: 'BTCUSDT', ltf: '1m', htf: '1h' }
	])
	const [newSymbol, setNewSymbol] = useState('')
	const [defaultLtf, setDefaultLtf] = useState('1m')
	const [defaultHtf, setDefaultHtf] = useState('1h')

	// Используем WebSocket подписки (множественные символы)
	const { regimes, isConnected, subscribe, unsubscribe, error } =
		useRegimeSocketSubscription()

	// Автоматическая подписка при подключении
	useEffect(() => {
		if (isConnected && symbolConfigs.length > 0) {
			const symbols = symbolConfigs.map(config => config.symbol)
			const allTimeframes = [
				...new Set(symbolConfigs.flatMap(config => [config.ltf, config.htf]))
			]
			console.log('🔄 Auto-subscribing to symbols:', symbols)
			console.log('🔄 Timeframes:', allTimeframes)
			subscribe(symbols, allTimeframes)
		}
	}, [isConnected, symbolConfigs, subscribe])

	// Добавить символ для отслеживания
	const handleAddSymbol = () => {
		const symbolToAdd = newSymbol.trim().toUpperCase()

		if (!symbolToAdd) {
			alert('⚠️ Введите символ')
			return
		}

		if (symbolConfigs.some(config => config.symbol === symbolToAdd)) {
			alert('⚠️ Этот символ уже отслеживается')
			return
		}

		const newConfig: SymbolConfig = {
			symbol: symbolToAdd,
			ltf: defaultLtf,
			htf: defaultHtf
		}

		const updatedConfigs = [...symbolConfigs, newConfig]
		setSymbolConfigs(updatedConfigs)
		setNewSymbol('')

		// Обновляем подписку
		if (isConnected) {
			const symbols = updatedConfigs.map(config => config.symbol)
			const allTimeframes = [
				...new Set(updatedConfigs.flatMap(config => [config.ltf, config.htf]))
			]
			subscribe(symbols, allTimeframes)
		}
	}

	// Удалить символ из отслеживания
	const handleRemoveSymbol = (symbolToRemove: string) => {
		if (symbolConfigs.length === 1) {
			alert('⚠️ Нельзя удалить последний символ')
			return
		}

		const updatedConfigs = symbolConfigs.filter(
			config => config.symbol !== symbolToRemove
		)
		setSymbolConfigs(updatedConfigs)

		// Обновляем подписку
		if (isConnected && updatedConfigs.length > 0) {
			const symbols = updatedConfigs.map(config => config.symbol)
			const allTimeframes = [
				...new Set(updatedConfigs.flatMap(config => [config.ltf, config.htf]))
			]
			subscribe(symbols, allTimeframes)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>Market Regime Subscriptions</h1>
				<p className={styles.subtitle}>
					Comprehensive market analysis with multi-symbol regime detection
				</p>
			</div>

			{/* Ошибки подключения */}
			{error && (
				<div
					style={{
						padding: '1rem',
						marginBottom: '1rem',
						background: '#fee',
						border: '1px solid #fcc',
						borderRadius: '0.5rem',
						color: '#c33'
					}}
				>
					<strong>⚠️ Error:</strong> {error}
				</div>
			)}

			{/* Статус соединения */}
			<div className={styles.statusBar}>
				<span className={isConnected ? styles.connected : styles.disconnected}>
					{isConnected ? '🟢 Connected' : '🔴 Disconnected'}
				</span>
				<span className={styles.regimeCount}>
					Active subscriptions: {regimes.size}
				</span>
			</div>

			{/* Панель добавления нового символа */}
			<div className={styles.addSymbolPanel}>
				<h3 className={styles.panelTitle}>➕ Add New Symbol</h3>

				<div className={styles.addSymbolControls}>
					<div className={styles.controlGroup}>
						<label className={styles.label}>Symbol:</label>
						<input
							type='text'
							value={newSymbol}
							onChange={e => setNewSymbol(e.target.value)}
							onKeyPress={e => e.key === 'Enter' && handleAddSymbol()}
							placeholder='Enter symbol (e.g., ETHUSDT)'
							className={styles.symbolInput}
							disabled={!isConnected}
						/>
					</div>

					<div className={styles.controlGroup}>
						<label className={styles.label}>LTF:</label>
						<select
							value={defaultLtf}
							onChange={e => setDefaultLtf(e.target.value)}
							className={styles.select}
							disabled={!isConnected}
						>
							{AVAILABLE_TIMEFRAMES.map(tf => (
								<option
									key={tf.value}
									value={tf.value}
								>
									{tf.label}
								</option>
							))}
						</select>
					</div>

					<div className={styles.controlGroup}>
						<label className={styles.label}>HTF:</label>
						<select
							value={defaultHtf}
							onChange={e => setDefaultHtf(e.target.value)}
							className={styles.select}
							disabled={!isConnected}
						>
							{AVAILABLE_TIMEFRAMES.map(tf => (
								<option
									key={tf.value}
									value={tf.value}
								>
									{tf.label}
								</option>
							))}
						</select>
					</div>

					<button
						onClick={handleAddSymbol}
						className={styles.addButton}
						disabled={!isConnected || !newSymbol.trim()}
					>
						➕ Add Symbol
					</button>
				</div>

				<div className={styles.quickAdd}>
					<span className={styles.quickAddLabel}>Quick add:</span>
					{POPULAR_SYMBOLS.filter(
						sym => !symbolConfigs.some(config => config.symbol === sym)
					).map(symbol => (
						<button
							key={symbol}
							onClick={() => {
								const newConfig: SymbolConfig = {
									symbol,
									ltf: defaultLtf,
									htf: defaultHtf
								}
								const updatedConfigs = [...symbolConfigs, newConfig]
								setSymbolConfigs(updatedConfigs)

								if (isConnected) {
									const symbols = updatedConfigs.map(config => config.symbol)
									const allTimeframes = [
										...new Set(
											updatedConfigs.flatMap(config => [config.ltf, config.htf])
										)
									]
									subscribe(symbols, allTimeframes)
								}
							}}
							className={styles.quickAddButton}
							disabled={!isConnected}
						>
							{symbol}
						</button>
					))}
				</div>
			</div>

			{/* Блоки символов */}
			<div className={styles.symbolBlocks}>
				{symbolConfigs.map(config => (
					<div
						key={config.symbol}
						className={styles.symbolBlock}
					>
						<div className={styles.symbolBlockHeader}>
							<div className={styles.symbolBlockTitle}>
								<h2>{config.symbol}</h2>
								<span className={styles.timeframes}>
									LTF: {config.ltf} | HTF: {config.htf}
								</span>
							</div>
							<button
								onClick={() => handleRemoveSymbol(config.symbol)}
								className={styles.removeBlockButton}
								disabled={symbolConfigs.length === 1 || !isConnected}
								title={
									symbolConfigs.length === 1
										? 'Cannot remove last symbol'
										: 'Remove this symbol block'
								}
							>
								🗑️ Remove
							</button>
						</div>

						<div className={styles.symbolBlockContent}>
							{/* Market Regime */}
							<div className={styles.widgetCard}>
								<h3 className={styles.widgetTitle}>Market Regime</h3>
								<RegimeWidget
									symbol={config.symbol}
									timeframe={config.ltf}
									showStatus={true}
									showSparkline={true}
									sparklinePoints={300}
								/>
							</div>

							{/* Regime Health */}
							<div className={styles.widgetCard}>
								<h3 className={styles.widgetTitle}>Regime Health</h3>
								<RegimeHealth
									symbol={config.symbol}
									timeframe={config.ltf}
									maxLagSec={180}
									refreshInterval={15000}
								/>
							</div>

							{/* Regime Context */}
							<div className={styles.widgetCard}>
								<h3 className={styles.widgetTitle}>Regime Context</h3>
								<RegimeContext
									symbol={config.symbol}
									ltf={config.ltf}
									htf={config.htf}
									signalType='fvg'
									side='long'
									refreshInterval={15000}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
