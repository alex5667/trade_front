/**
 * Order Flow Socket.IO
 * --------------------------------
 * WebSocket клиент для получения Order Flow данных в реальном времени
 */
'use client'

import { io, Socket } from 'socket.io-client'

const OF_SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'

let orderFlowSocket: Socket | null = null

/**
 * Получить экземпляр Order Flow Socket.IO соединения (синглтон)
 * @returns Socket.IO соединение для Order Flow данных
 */
export function getOrderFlowSocket(): Socket {
	if (typeof window === 'undefined') {
		// На сервере возвращаем фиктивный объект
		return {} as Socket
	}

	if (!orderFlowSocket) {
		console.log(`🔌 Инициализация Order Flow Socket.IO: ${OF_SOCKET_URL}/signals`)

		orderFlowSocket = io(`${OF_SOCKET_URL}/signals`, {
			transports: ['websocket', 'polling'],
			autoConnect: true,
			reconnection: true,
			reconnectionDelay: 2000,
			reconnectionAttempts: 10
		})

		// Логирование подключения
		orderFlowSocket.on('connect', () => {
			console.log('✅ Order Flow Socket.IO подключен, ID:', orderFlowSocket?.id)
		})

		orderFlowSocket.on('disconnect', (reason) => {
			console.log('⚠️ Order Flow Socket.IO отключен, причина:', reason)
		})

		orderFlowSocket.on('connect_error', (error) => {
			console.error('❌ Ошибка подключения Order Flow Socket.IO:', error.message)
		})
	}

	return orderFlowSocket
}

/**
 * Отключиться от Order Flow Socket.IO
 */
export function disconnectOrderFlowSocket(): void {
	if (orderFlowSocket) {
		console.log('🔌 Отключение Order Flow Socket.IO...')
		orderFlowSocket.disconnect()
		orderFlowSocket = null
	}
}

