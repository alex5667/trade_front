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

import { useSignalInitializer } from '@/hooks/useSignalInitializer'
import { useSignalSocketInitializer } from '@/hooks/useSignalSocketInitializer'

import { initializeSignalService } from '@/services/signal.service'

/**
 * This component initializes the Socket.IO connection for signals
 * and doesn't render anything visible in the UI.
 */
const SignalSocketInitializerComponent = () => {
	const dispatch = useDispatch<AppDispatch>()

	console.log('🔌 SignalSocketInitializer компонент создан')

	// Используем хук для создания и настройки Socket.IO соединения (только статус)
	useSignalSocketInitializer()

	// Запускаем REST-инициализацию данных (Top gainers/losers, volume, funding, volatility)
	useSignalInitializer()

	// Инициализация сервиса сигналов (волатильность/price change)
	useEffect(() => {
		const cleanup = initializeSignalService(dispatch)
		return () => {
			if (cleanup) cleanup()
		}
	}, [dispatch])

	return null
}

export const SignalSocketInitializer = React.memo(
	SignalSocketInitializerComponent,
	() => true
)
