/**
 * Примеры использования компонента SignalsList
 * ------------------------------
 * Различные сценарии интеграции списка сигналов с фильтрацией
 */

'use client'

import React from 'react'

import { RegimeWidget } from '@/components/regime-badge'
import { FilterableSignal } from '@/types/signal.types'

import { SignalsList } from './SignalsList'

/**
 * Пример 1: Простой список с фильтрацией
 */
export const BasicSignalsListExample = () => {
	// Пример данных (в реальном приложении будут из API/Redux)
	const mockSignals: FilterableSignal[] = [
		{ type: 'fvg', side: 'long', symbol: 'BTCUSDT' },
		{ type: 'ob', side: 'short', symbol: 'ETHUSDT' },
		{ type: 'volumeSpike', symbol: 'BNBUSDT' },
		{ type: 'breaker', side: 'long', symbol: 'SOLUSDT' },
	]

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Trading Signals</h2>
			<SignalsList signals={mockSignals} enableFiltering={true} />
		</div>
	)
}

/**
 * Пример 2: С виджетом режима и списком сигналов
 */
export const DashboardWithSignalsExample = () => {
	const mockSignals: FilterableSignal[] = [
		{ type: 'fvg', side: 'long', symbol: 'BTCUSDT' },
		{ type: 'ob', side: 'short', symbol: 'ETHUSDT' },
		{ type: 'smt', symbol: 'ADAUSDT' },
		{ type: 'volumeSpike', symbol: 'DOGEUSDT' },
	]

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Trading Dashboard</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Левая колонка: Виджет режима */}
				<div className="lg:col-span-1">
					<RegimeWidget
						symbol="BTCUSDT"
						timeframe="1m"
						showSparkline={true}
					/>
				</div>

				{/* Правая колонка: Список сигналов */}
				<div className="lg:col-span-2">
					<SignalsList signals={mockSignals} enableFiltering={true} />
				</div>
			</div>
		</div>
	)
}

/**
 * Пример 3: Показать все сигналы включая отфильтрованные
 */
export const SignalsWithFilteredExample = () => {
	const mockSignals: FilterableSignal[] = [
		{ type: 'fvg', side: 'long', symbol: 'BTCUSDT' },
		{ type: 'fvg', side: 'short', symbol: 'ETHUSDT' }, // будет отфильтрован в trending_bull
		{ type: 'ob', side: 'long', symbol: 'BNBUSDT' },
		{ type: 'ob', side: 'short', symbol: 'SOLUSDT' }, // будет отфильтрован в trending_bull
		{ type: 'volumeSpike', symbol: 'ADAUSDT' },
	]

	return (
		<div className="p-4 space-y-4">
			<div>
				<h3 className="font-bold mb-2">Active Signals (Filtered)</h3>
				<SignalsList signals={mockSignals} showFiltered={false} />
			</div>

			<div>
				<h3 className="font-bold mb-2">All Signals (Including Filtered)</h3>
				<SignalsList signals={mockSignals} showFiltered={true} />
			</div>
		</div>
	)
}

/**
 * Пример 4: Интеграция с реальными данными из Redux/API
 */
export const RealDataSignalsExample = () => {
	// В реальном приложении:
	// const signals = useSelector(selectSignals)
	// const { regime } = useRegimeSocket()

	const mockSignals: FilterableSignal[] = [
		{ type: 'fvg', side: 'long', symbol: 'BTCUSDT', price: 45000 },
		{ type: 'ob', side: 'short', symbol: 'ETHUSDT', price: 3200 },
		{ type: 'breaker', side: 'long', symbol: 'SOLUSDT', price: 105 },
	]

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<RegimeWidget
					symbol="BTCUSDT"
					timeframe="5m"
					showSparkline={true}
					sparklinePoints={100}
				/>
			</div>

			<div className="bg-gray-800 rounded-lg p-4">
				<h2 className="text-lg font-bold mb-4">Live Trading Signals</h2>
				<SignalsList 
					signals={mockSignals} 
					enableFiltering={true}
					showFiltered={false}
				/>
			</div>
		</div>
	)
}

/**
 * Пример 5: Мультисимвольный дашборд
 */
export const MultiSymbolDashboardExample = () => {
	const btcSignals: FilterableSignal[] = [
		{ type: 'fvg', side: 'long', symbol: 'BTCUSDT' },
		{ type: 'volumeSpike', symbol: 'BTCUSDT' },
	]

	const ethSignals: FilterableSignal[] = [
		{ type: 'ob', side: 'short', symbol: 'ETHUSDT' },
		{ type: 'smt', symbol: 'ETHUSDT' },
	]

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Multi-Symbol Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* BTC */}
				<div className="space-y-4">
					<RegimeWidget
						symbol="BTCUSDT"
						timeframe="1m"
						showSparkline={true}
					/>
					<SignalsList signals={btcSignals} />
				</div>

				{/* ETH */}
				<div className="space-y-4">
					<RegimeWidget
						symbol="ETHUSDT"
						timeframe="1m"
						showSparkline={true}
					/>
					<SignalsList signals={ethSignals} />
				</div>
			</div>
		</div>
	)
}

