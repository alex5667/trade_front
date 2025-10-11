/**
 * Хук useRegimeAlerts - получение алертов о здоровье режима
 * ------------------------------
 * Подключается к WebSocket и слушает событие 'regime:alert'
 * для получения уведомлений о проблемах с пайплайном
 */

'use client'

import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

import { WEBSOCKET_CONFIG } from '@/config/websocket.config'
import { RegimeAlert } from '@/types/signal.types'

interface UseRegimeAlertsReturn {
	socket: Socket | null
	lastAlert: RegimeAlert | null
	isConnected: boolean
}

export const useRegimeAlerts = (): UseRegimeAlertsReturn => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [lastAlert, setLastAlert] = useState<RegimeAlert | null>(null)
	const [isConnected, setIsConnected] = useState<boolean>(false)

	useEffect(() => {
		// Создаем Socket.IO подключение
		const socketInstance = io(WEBSOCKET_CONFIG.url, {
			path: '/socket.io',
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionAttempts: WEBSOCKET_CONFIG.maxReconnectAttempts,
			reconnectionDelay: WEBSOCKET_CONFIG.reconnectDelay,
			timeout: WEBSOCKET_CONFIG.connectionTimeout,
			autoConnect: true,
			forceNew: false,
		})

		setSocket(socketInstance)

		// Обработчик подключения
		socketInstance.on('connect', () => {
			console.log('✅ Regime Alerts WebSocket подключен:', {
				id: socketInstance.id,
				url: WEBSOCKET_CONFIG.url
			})
			setIsConnected(true)
		})

		// Обработчик отключения
		socketInstance.on('disconnect', (reason) => {
			console.log('❌ Regime Alerts WebSocket отключен:', reason)
			setIsConnected(false)
		})

		// Обработчик ошибок подключения
		socketInstance.on('connect_error', (error) => {
			console.warn('⚠️ Regime Alerts WebSocket недоступен:', {
				message: error.message,
				url: WEBSOCKET_CONFIG.url,
				note: 'Alerts будут недоступны, но приложение продолжит работу'
			})
			setIsConnected(false)
		})

		// Обработчик общих ошибок
		socketInstance.on('error', (error) => {
			console.error('🔴 WebSocket error:', error)
		})

		// Слушаем событие 'regime:alert'
		socketInstance.on('regime:alert', (data: RegimeAlert) => {
			console.log('🚨 Regime Alert:', data)
			setLastAlert(data)
		})

		// Cleanup при размонтировании
		return () => {
			socketInstance.off('connect')
			socketInstance.off('disconnect')
			socketInstance.off('connect_error')
			socketInstance.off('error')
			socketInstance.off('regime:alert')
			socketInstance.close()
		}
	}, [])

	return { socket, lastAlert, isConnected }
}

