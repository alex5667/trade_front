'use client'

/**
 * ConnectionStatus Component
 * ------------------------------
 * Displays the current WebSocket connection status
 */
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { selectConnectionStatus } from '@/store/signals/selectors/signals.selectors'

export const ConnectionStatus = () => {
	const componentId = useRef(`connection-status-${Date.now()}`)
	console.log(`🚦 [${componentId.current}] ConnectionStatus компонент создан`)

	const status = useSelector(selectConnectionStatus)
	const prevStatusRef = useRef(status)

	// Логирование изменения статуса соединения
	useEffect(() => {
		if (prevStatusRef.current !== status) {
			console.log(
				`📡 [${componentId.current}] Изменение статуса соединения: ${prevStatusRef.current} -> ${status}`
			)
			prevStatusRef.current = status
		}
	}, [status])

	// Эффект для отслеживания жизненного цикла компонента
	useEffect(() => {
		console.log(`🔄 [${componentId.current}] ConnectionStatus эффект запущен`)

		return () => {
			console.log(`🛑 [${componentId.current}] ConnectionStatus размонтирован`)
		}
	}, [])

	// Map status to display text and CSS class
	const getStatusInfo = () => {
		switch (status) {
			case 'connected':
				return { text: 'Connected', className: 'text-green-500' }
			case 'connecting':
				return { text: 'Connecting...', className: 'text-yellow-500' }
			case 'disconnected':
				return { text: 'Disconnected', className: 'text-red-500' }
			case 'error':
				return { text: 'Connection Error', className: 'text-red-500' }
			default:
				return { text: 'Unknown', className: 'text-gray-500' }
		}
	}

	const { text, className } = getStatusInfo()

	// Логируем текущее отображаемое состояние
	console.log(
		`🔄 [${componentId.current}] Текущий статус: ${text} (${className})`
	)

	return (
		<div className='flex items-center'>
			<div
				className={`w-3 h-3 rounded-full mr-2 ${className.includes('green') ? 'bg-green-500' : className.includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}
			></div>
			<span className={className}>{text}</span>
		</div>
	)
}
