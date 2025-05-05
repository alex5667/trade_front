'use client'

/**
 * SignalSocketInitializer - компонент для инициализации WebSocket соединения
 *
 * Этот компонент не отображает никакого UI, а только инициализирует
 * WebSocket соединение для получения торговых сигналов.
 *
 * Он должен быть размещен в корневом компоненте приложения или
 * на странице сигналов для обеспечения установки соединения.
 */
import React, { useEffect } from 'react'

import { useSignalSocketInitializer } from '@/hooks/useSignalSocketInitializer'

/**
 * This component initializes the WebSocket connection for signals
 * and doesn't render anything visible in the UI.
 */
const SignalSocketInitializerComponent = () => {
	// Компонент создан
	console.log('🔌 SignalSocketInitializer компонент создан')

	// Используем хук для создания и настройки WebSocket соединения
	useSignalSocketInitializer()

	// Эффект для отслеживания жизненного цикла компонента
	useEffect(() => {
		console.log('🔄 SignalSocketInitializer эффект запущен')

		return () => {
			console.log('🛑 SignalSocketInitializer размонтирован')
		}
	}, [])

	// Компонент не рендерит UI
	return null
}

// Оборачиваем в React.memo для предотвращения лишних перерисовок
export const SignalSocketInitializer = React.memo(
	SignalSocketInitializerComponent,
	() => true
)
