'use client'

'use strict'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4200'

export function useSignalSocket() {
	const [signals, setSignals] = useState<any[]>([])

	useEffect(() => {
		console.log('Attempting to connect to socket at:', SOCKET_URL)

		const socket: Socket = io(SOCKET_URL, {
			transports: ['websocket', 'polling'],
			reconnectionAttempts: 5,
			path: '/socket.io'
		})

		socket.on('connect', () => {
			console.log('✅ Подключено к WebSocket', socket.id)
			// Try subscribing to signals
			socket.emit('subscribe', 'binance:kline')
		})

		socket.on('connect_error', (error) => {
			console.error('❌ Socket connection error:', error.message)
		})

		socket.on('disconnect', (reason) => {
			console.log('⚠️ Socket disconnected:', reason)
		})

		// Listen for kline events from Redis as shown in the logs
		socket.on('binance:kline', (signal) => {
			console.log('📡 Received kline signal:', signal)
			setSignals(prev => [signal, ...prev.slice(0, 99)])
		})

		socket.on('new-signal', (signal) => {
			console.log('📡 Received new signal:', signal)
			setSignals(prev => [signal, ...prev.slice(0, 99)])
		})

		return () => {
			console.log('Disconnecting socket')
			socket.disconnect()
		}
	}, [])

	return signals
}
