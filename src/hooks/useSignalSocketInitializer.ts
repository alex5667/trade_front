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

import { getSocketIOClient } from '@/services/socket-io.service'
import { setConnectionStatus } from '@/store/signals/slices/connection.slice'

export const useSignalSocketInitializer = () => {
	const dispatch = useDispatch()
	const clientRef = useRef<any>(null)
	const componentIdRef = useRef(`socket-init-${Date.now()}`)

	console.log(`🔌 [${componentIdRef.current}] Инициализатор Socket.IO создан`)

	useEffect(() => {
		console.log(`🚀 [${componentIdRef.current}] Инициализация Socket.IO соединения`)

		const client = getSocketIOClient()
		clientRef.current = client

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

		// ВАЖНО: не подписываемся на топы и объём/фандинг через WebSocket
		// Эти данные теперь получаем только через REST API

		client.connect()

		return () => {
			console.log(`🛑 [${componentIdRef.current}] Очистка Socket.IO соединения`)
			if (clientRef.current) {
				clientRef.current.disconnect()
				clientRef.current = null
			}
		}
	}, [dispatch])

	return { isConnected: clientRef.current?.connected || false }
} 