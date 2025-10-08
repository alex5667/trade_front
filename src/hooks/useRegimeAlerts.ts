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
		})

		setSocket(socketInstance)

		// Обработчик подключения
		socketInstance.on('connect', () => {
			console.log('✅ Regime Alerts WebSocket подключен')
			setIsConnected(true)
		})

		// Обработчик отключения
		socketInstance.on('disconnect', (reason) => {
			console.log('❌ Regime Alerts WebSocket отключен:', reason)
			setIsConnected(false)
		})

		// Обработчик ошибок
		socketInstance.on('connect_error', (error) => {
			console.error('🔴 Ошибка подключения Regime Alerts WebSocket:', error)
			setIsConnected(false)
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
			socketInstance.off('regime:alert')
			socketInstance.close()
		}
	}, [])

	return { socket, lastAlert, isConnected }
}

