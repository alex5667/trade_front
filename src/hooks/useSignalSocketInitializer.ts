/**
 * Хук для инициализации WebSocket соединения сигналов
 * ------------------------------
 * Управляет WebSocket соединением для получения торговых сигналов
 * и автоматически обновляет Redux store полученными данными.
 * 
 * Использует Socket.IO для надежного соединения с автоматическим
 * переподключением при обрыве связи.
 */

import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { io, Socket } from 'socket.io-client'

import { setConnectionStatus } from '@/store/signals/slices/connection.slice'
import {
	addTimeframeGainer,
	addTimeframeLoser
} from '@/store/signals/slices/timeframe.slice'
import { addTriggerEvent } from '@/store/signals/slices/trigger.slice'

import { TimeframeCoin, TriggerEvent } from '@/store/signals/signal.types'

/**
 * Хук для инициализации WebSocket соединения
 * 
 * Особенности работы:
 * - Автоматически устанавливает соединение при монтировании
 * - Обрабатывает события только для 24h таймфрейма
 * - Управляет состоянием соединения в Redux
 * - Очищает ресурсы при размонтировании
 */
export const useSignalSocketInitializer = () => {
	const dispatch = useDispatch()
	const socketRef = useRef<Socket | null>(null)
	const componentIdRef = useRef(`socket-init-${Date.now()}`)

	// URL для подключения к WebSocket серверу
	const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:3001'

	console.log(`🔌 [${componentIdRef.current}] Инициализатор WebSocket создан`)

	useEffect(() => {
		console.log(`🚀 [${componentIdRef.current}] Инициализация WebSocket соединения`)

		// Создаем новое Socket.IO соединение
		const socket = io(SOCKET_URL, {
			autoConnect: true,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 10,
			timeout: 20000
		})

		socketRef.current = socket

		// Обработчики событий соединения
		socket.on('connect', () => {
			console.log(`✅ [${componentIdRef.current}] WebSocket подключен (ID: ${socket.id})`)
			dispatch(setConnectionStatus(true))
		})

		socket.on('disconnect', (reason) => {
			console.log(`❌ [${componentIdRef.current}] WebSocket отключен: ${reason}`)
			dispatch(setConnectionStatus(false))
		})

		socket.on('connect_error', (error) => {
			console.error(`🔥 [${componentIdRef.current}] Ошибка подключения:`, error)
			dispatch(setConnectionStatus(false))
		})

		// Обработчики торговых сигналов для 24h таймфрейма
		socket
			.on('top:gainers:24h', (data: TimeframeCoin) => {
				console.log(`📈 [${componentIdRef.current}] Получен top gainer 24h:`, data.symbol)
				dispatch(addTimeframeGainer({ timeframe: '24h', data }))
			})
			.on('top:losers:24h', (data: TimeframeCoin) => {
				console.log(`📉 [${componentIdRef.current}] Получен top loser 24h:`, data.symbol)
				dispatch(addTimeframeLoser({ timeframe: '24h', data }))
			})

		// Обработчики триггерных событий для 24h таймфрейма
		socket
			.on('trigger:gainers-24h', (data: string[]) => {
				console.log(`🔔 [${componentIdRef.current}] Триггер gainers 24h:`, data)
				const triggerEvent: TriggerEvent = {
					timeframe: '24h',
					type: 'gainers',
					data
				}
				dispatch(addTriggerEvent(triggerEvent))
			})
			.on('trigger:losers-24h', (data: string[]) => {
				console.log(`🔔 [${componentIdRef.current}] Триггер losers 24h:`, data)
				const triggerEvent: TriggerEvent = {
					timeframe: '24h',
					type: 'losers',
					data
				}
				dispatch(addTriggerEvent(triggerEvent))
			})

		// Cleanup функция
		return () => {
			console.log(`🛑 [${componentIdRef.current}] Очистка WebSocket соединения`)
			if (socket) {
				socket.disconnect()
			}
		}
	}, [dispatch, SOCKET_URL])

	// Возвращаем статус соединения для компонентов
	return {
		isConnected: socketRef.current?.connected || false
	}
} 