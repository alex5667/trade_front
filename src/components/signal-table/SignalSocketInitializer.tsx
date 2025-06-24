'use client'

/**
 * SignalSocketInitializer - компонент для инициализации Socket.IO соединения
 *
 * Этот компонент не отображает никакого UI, а только инициализирует
 * Socket.IO соединение для получения торговых сигналов.
 *
 * Он должен быть размещен в корневом компоненте приложения или
 * на странице сигналов для обеспечения установки соединения.
 */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatch } from '@/store/store'

import { useSignalSocketInitializer } from '@/hooks/useSignalSocketInitializer'

import { initializeSignalService } from '@/services/signal.service'

/**
 * This component initializes the Socket.IO connection for signals
 * and doesn't render anything visible in the UI.
 */
const SignalSocketInitializerComponent = () => {
	const dispatch = useDispatch<AppDispatch>()

	// Компонент создан
	console.log('🔌 SignalSocketInitializer компонент создан')

	// Используем хук для создания и настройки Socket.IO соединения (timeframe events)
	useSignalSocketInitializer()

	// Эффект для инициализации полного сервиса сигналов (volatility, volume, price change)
	useEffect(() => {
		console.log(
			'🔄 SignalSocketInitializer эффект запущен - инициализация сервиса сигналов'
		)

		// Инициализируем полный сервис сигналов для обработки всех типов событий
		const cleanup = initializeSignalService(dispatch)

		return () => {
			console.log(
				'🛑 SignalSocketInitializer размонтирован - очистка сервиса сигналов'
			)
			if (cleanup) {
				cleanup()
			}
		}
	}, [dispatch])

	// Компонент не рендерит UI
	return null
}

// Оборачиваем в React.memo для предотвращения лишних перерисовок
export const SignalSocketInitializer = React.memo(
	SignalSocketInitializerComponent,
	() => true
)
