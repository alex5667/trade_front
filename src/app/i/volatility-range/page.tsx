'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { VolatilityRangeComponent } from '@/components/Signals/VolatilitySignal/VolatilityRangeComponent'
import { ConnectionStatus } from '@/components/signal-table/connection-status/ConnectionStatus'

import {
	selectConnectionStatus,
	selectVolatilityRangeLastUpdated,
	selectVolatilityRangeSignals
} from '@/store/signals'

/**
 * Страница сигналов диапазона волатильности
 *
 * Отображает таблицу с сигналами диапазона волатильности,
 * статус подключения и обрабатывает различные состояния соединения.
 */
export default function VolatilityPage() {
	/** Флаг инициализации компонента */
	const [isInitialized, setIsInitialized] = useState(false)

	/** Сигналы диапазона волатильности из Redux */
	const volatilityRangeSignals = useSelector(selectVolatilityRangeSignals)
	/** Время последнего обновления */
	const lastUpdated = useSelector(selectVolatilityRangeLastUpdated)
	/** Статус подключения (boolean) */
	const isConnected = useSelector(selectConnectionStatus)

	console.log('volatilityRangeSignals', volatilityRangeSignals)
	console.log('isConnected', isConnected)

	/** Мемоизированное количество сигналов для избежания пересчета */
	const signalCount = useMemo(
		() => volatilityRangeSignals?.length || 0,
		[volatilityRangeSignals]
	)

	// Безопасное логирование сигналов без потенциальных проблем с каналом сообщений
	useEffect(() => {
		if (signalCount > 0 && isInitialized) {
			console.log(`Загружено сигналов диапазона волатильности: ${signalCount}`)
		}
	}, [signalCount, isInitialized, lastUpdated])

	// Отмечаем компонент как инициализированный после монтирования
	useEffect(() => {
		setIsInitialized(true)
		return () => {
			setIsInitialized(false)
		}
	}, [])

	return (
		<>
			{/* Отображаем таблицу с сигналами */}
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>
					Сигналы диапазона волатильности
				</h1>
				<ConnectionStatus />
				{!isConnected && (
					<div className='mb-4 p-3 rounded bg-yellow-100 text-yellow-800'>
						WebSocket отключен. Ожидание переподключения...
					</div>
				)}
				{isConnected && signalCount === 0 ? (
					<div className='p-4 bg-gray-100 text-gray-700 rounded'>
						Нет доступных сигналов диапазона волатильности. Ожидание данных...
					</div>
				) : (
					<VolatilityRangeComponent
						maxSignals={20}
						title='Сигналы диапазона волатильности'
					/>
				)}
			</div>
		</>
	)
}
