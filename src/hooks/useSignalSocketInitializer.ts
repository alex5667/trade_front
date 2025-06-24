/**
 * Хук для инициализации Socket.IO соединения сигналов
 * ------------------------------
 * Управляет Socket.IO соединением для получения торговых сигналов
 * и автоматически обновляет Redux store полученными данными.
 * 
 * Использует Socket.IO для надежного соединения с автоматическим
 * переподключением при обрыве связи.
 */

import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { setConnectionStatus } from '@/store/signals/slices/connection.slice'
import {
	addTimeframeGainer,
	addTimeframeLoser
} from '@/store/signals/slices/timeframe.slice'
import { addTriggerEvent } from '@/store/signals/slices/trigger.slice'

import { getSocketIOClient } from '@/services/socket-io.service'
import { TimeframeCoin } from '@/store/signals/signal.types'

/**
 * Хук для инициализации Socket.IO соединения
 * 
 * Особенности работы:
 * - Автоматически устанавливает соединение при монтировании
 * - Обрабатывает события только для 24h таймфрейма
 * - Управляет состоянием соединения в Redux
 * - Очищает ресурсы при размонтировании
 */
export const useSignalSocketInitializer = () => {
	const dispatch = useDispatch()
	const clientRef = useRef<any>(null)
	const componentIdRef = useRef(`socket-init-${Date.now()}`)

	console.log(`🔌 [${componentIdRef.current}] Инициализатор Socket.IO создан`)

	useEffect(() => {
		console.log(`🚀 [${componentIdRef.current}] Инициализация Socket.IO соединения`)

		// Получаем Socket.IO клиент
		const client = getSocketIOClient()
		clientRef.current = client

		// Обработчики событий соединения
		client.on('connect', () => {
			console.log(`✅ [${componentIdRef.current}] Socket.IO подключен`)
			dispatch(setConnectionStatus(true))
		})

		client.on('disconnect', (reason: any) => {
			console.log(`❌ [${componentIdRef.current}] Socket.IO отключен: ${reason}`)
			dispatch(setConnectionStatus(false))
		})

		client.on('error', (error: any) => {
			console.error(`🔥 [${componentIdRef.current}] Ошибка подключения:`, error)
			dispatch(setConnectionStatus(false))
		})

		// Обработчики торговых сигналов для 24h таймфрейма
		client
			.on('top:gainers:24h', (data: TimeframeCoin) => {
				console.log(`📈 [${componentIdRef.current}] Получен top gainer 24h:`, data.symbol)
				dispatch(addTimeframeGainer({ timeframe: '24h', data }))
			})
			.on('top:losers:24h', (data: TimeframeCoin) => {
				console.log(`📉 [${componentIdRef.current}] Получен top loser 24h:`, data.symbol)
				dispatch(addTimeframeLoser({ timeframe: '24h', data }))
			})
			.on('trigger:gainers-24h', (data: string[]) => {
				console.log(`📢 [${componentIdRef.current}] Получен trigger gainer 24h:`, data)
				dispatch(addTriggerEvent({
					timeframe: '24h',
					type: 'gainers',
					data: data
				}))
			})
			.on('trigger:losers-24h', (data: string[]) => {
				console.log(`📢 [${componentIdRef.current}] Получен trigger loser 24h:`, data)
				dispatch(addTriggerEvent({
					timeframe: '24h',
					type: 'losers',
					data: data
				}))
			})

		// Подключаемся к серверу
		client.connect()

		// Cleanup функция
		return () => {
			console.log(`🛑 [${componentIdRef.current}] Очистка Socket.IO соединения`)

			if (clientRef.current) {
				clientRef.current.disconnect()
				clientRef.current = null
			}
		}
	}, [dispatch])

	// Возвращаем статус соединения для компонентов
	return {
		isConnected: clientRef.current?.connected || false
	}
} 