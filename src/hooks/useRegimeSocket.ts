/**
 * Хук для получения данных Market Regime через WebSocket
 * ------------------------------
 * Подключается к Socket.IO серверу и слушает событие 'regime'
 * для получения данных о текущем рыночном режиме в реальном времени
 */

import { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

import { WEBSOCKET_CONFIG } from '@/config/websocket.config'
import { RegimeSignal } from '@/types/signal.types'

interface UseRegimeSocketReturn {
	socket: Socket | null
	regime: RegimeSignal | null
	isConnected: boolean
}

export const useRegimeSocket = (): UseRegimeSocketReturn => {
	const [socket, setSocket] = useState<Socket | null>(null)
	const [regime, setRegime] = useState<RegimeSignal | null>(null)
	const [isConnected, setIsConnected] = useState<boolean>(false)

	useEffect(() => {
		// Создаем Socket.IO подключение с конфигурацией из проекта
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
			setIsConnected(true)
		})

		// Обработчик отключения
		socketInstance.on('disconnect', () => {
			setIsConnected(false)
		})

		// Обработчик ошибок подключения
		socketInstance.on('connect_error', () => {
			setIsConnected(false)
		})

		// Обработчик общих ошибок
		socketInstance.on('error', () => {
			// Ошибка обрабатывается через состояние подключения
		})

		// Слушаем событие 'regime'
		socketInstance.on('regime', (data: RegimeSignal & { symbol?: string; timeframe?: string }) => {
			setRegime(data)
		})

		// Cleanup при размонтировании
		return () => {
			socketInstance.off('connect')
			socketInstance.off('disconnect')
			socketInstance.off('connect_error')
			socketInstance.off('error')
			socketInstance.off('regime')
			socketInstance.close()
		}
	}, [])

	return { socket, regime, isConnected }
}

