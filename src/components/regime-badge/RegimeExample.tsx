/**
 * Примеры использования компонентов Market Regime
 * ------------------------------
 * Различные сценарии интеграции RegimeBadge и useRegimeSocket
 */

'use client'

import React from 'react'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'

import { RegimeBadge } from './RegimeBadge'
import { RegimeWidget } from './RegimeWidget'

/**
 * Пример 1: Простой бейдж в header
 */
export const RegimeHeaderExample = () => {
	const { regime } = useRegimeSocket()

	return (
		<header className="flex justify-between items-center p-4 bg-gray-800">
			<h1 className="text-xl font-bold">Trading Dashboard</h1>
			<RegimeBadge 
				regime={regime?.regime} 
				adx={regime?.adx} 
				atrPct={regime?.atrPct}
			/>
		</header>
	)
}

/**
 * Пример 2: Виджет в sidebar
 */
export const RegimeSidebarExample = () => {
	return (
		<aside className="w-64 p-4 bg-gray-900 space-y-4">
			<RegimeWidget />
			<div className="p-4 bg-gray-800 rounded">
				<h3 className="text-sm font-semibold mb-2">Other Widget</h3>
				<p className="text-xs text-gray-400">Content...</p>
			</div>
		</aside>
	)
}

/**
 * Пример 3: Компактный индикатор с только иконкой
 */
export const RegimeCompactExample = () => {
	const { regime, isConnected } = useRegimeSocket()

	if (!isConnected) return null

	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-gray-400">Market:</span>
			<RegimeBadge regime={regime?.regime} />
		</div>
	)
}

/**
 * Пример 4: Табличное представление с историей (концепт)
 */
export const RegimeHistoryExample = () => {
	const { regime } = useRegimeSocket()

	// В реальном приложении здесь был бы массив из истории режимов
	const history = [
		{ time: '14:30', regime: 'trending_bull', adx: 28.5, atrPct: 0.0245 },
		{ time: '14:00', regime: 'expansion', adx: 22.1, atrPct: 0.0289 },
		{ time: '13:30', regime: 'range', adx: 18.3, atrPct: 0.0156 },
	]

	return (
		<div className="bg-gray-800 rounded-lg p-4">
			<h3 className="text-sm font-semibold mb-3">Regime History</h3>
			
			{/* Текущий режим */}
			<div className="mb-4 p-3 bg-gray-700 rounded">
				<p className="text-xs text-gray-400 mb-2">Current</p>
				<RegimeBadge 
					regime={regime?.regime} 
					adx={regime?.adx} 
					atrPct={regime?.atrPct}
				/>
			</div>

			{/* История */}
			<div className="space-y-2">
				{history.map((item, index) => (
					<div key={index} className="flex items-center justify-between text-xs">
						<span className="text-gray-500">{item.time}</span>
						<RegimeBadge 
							regime={item.regime} 
							adx={item.adx} 
							atrPct={item.atrPct}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

/**
 * Пример 5: Grid layout с несколькими виджетами
 */
export const RegimeDashboardExample = () => {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Trading Dashboard</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<RegimeWidget showStatus={true} />
				
				<div className="bg-gray-800 p-4 rounded-lg">
					<h3 className="text-sm font-semibold mb-2">Volume</h3>
					<p className="text-2xl font-bold">$2.5M</p>
				</div>
				
				<div className="bg-gray-800 p-4 rounded-lg">
					<h3 className="text-sm font-semibold mb-2">Volatility</h3>
					<p className="text-2xl font-bold">2.34%</p>
				</div>
				
				<div className="bg-gray-800 p-4 rounded-lg">
					<h3 className="text-sm font-semibold mb-2">Signals</h3>
					<p className="text-2xl font-bold">12</p>
				</div>
			</div>
		</div>
	)
}

