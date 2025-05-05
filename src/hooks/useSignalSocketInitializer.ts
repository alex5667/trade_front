/**
 * useSignalSocketInitializer Hook
 * ------------------------------
 * Хук для инициализации WebSocket-соединения и настройки обработчиков
 * для разных типов торговых сигналов. Использует Redux для хранения
 * состояния соединения и сигналов.
 */
'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { getWebSocketClient } from '@/services/websocket.service'
import {
	FundingCoin,
	PriceChangeSignal,
	TimeframeCoin,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'
import {
	addFundingData,
	addPriceChangeSignal,
	addTimeframeGainer,
	addTimeframeLoser,
	addTimeframeVolume,
	addTriggerEvent,
	addVolatilitySignal,
	addVolumeSignal,
	setConnectionStatus
} from '@/store/signals/signals.slice'

/**
 * Хук для инициализации WebSocket соединения и настройки обработчиков сигналов
 * Отвечает за подключение к серверу и распределение получаемых сигналов по Redux-стору
 */
export const useSignalSocketInitializer = () => {
	const dispatch = useDispatch()
	const initialized = useRef(false)

	// Обработчик изменения статуса соединения
	const handleConnectionChange = useCallback(
		(isConnected: boolean) => {
			dispatch(setConnectionStatus(isConnected))
		},
		[dispatch]
	)

	// Инициализация WebSocket соединения
	useEffect(() => {
		// Не инициализируем дважды
		if (initialized.current) return

		const wsClient = getWebSocketClient()

		// Настраиваем обработчики событий
		wsClient
			// События подключения/отключения
			.on('connect', () => handleConnectionChange(true))
			.on('disconnect', () => handleConnectionChange(false))

			// Сигналы волатильности
			.on('signal:volatility', (data: VolatilitySignal) => {
				dispatch(addVolatilitySignal(data))
			})
			.on('volatilitySpike', (data: VolatilitySignal) => {
				dispatch(addVolatilitySignal(data))
			})
			.on('volatilityRange', (data: VolatilitySignal) => {
				dispatch(addVolatilitySignal(data))
			})

			// Сигналы объема
			.on('volumeSpike', (data: VolumeSignal) => {
				dispatch(addVolumeSignal(data))
			})

			// Сигналы изменения цены
			.on('priceChange', (data: PriceChangeSignal) => {
				dispatch(addPriceChangeSignal(data))
			})

			// Топ гейнеры/лузеры за 5 минут
			.on('top:gainers:5min', (data: TimeframeCoin) => {
				dispatch(addTimeframeGainer({ timeframe: '5min', data }))
			})
			.on('top:losers:5min', (data: TimeframeCoin) => {
				dispatch(addTimeframeLoser({ timeframe: '5min', data }))
			})
			.on('top:volume:5min', (data: VolumeSignal) => {
				dispatch(addTimeframeVolume({ timeframe: '5min', data }))
			})
			.on('top:funding:5min', (data: FundingCoin) => {
				dispatch(addFundingData({ data }))
			})

			// Топ гейнеры/лузеры за 24 часа
			.on('top:gainers:24h', (data: TimeframeCoin) => {
				dispatch(addTimeframeGainer({ timeframe: '24h', data }))
			})
			.on('top:losers:24h', (data: TimeframeCoin) => {
				dispatch(addTimeframeLoser({ timeframe: '24h', data }))
			})

			// Триггер-события (особые события для UI)
			.on('trigger:gainers-5min', (data: string[]) => {
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'gainers',
						data
					})
				)
			})
			.on('trigger:losers-5min', (data: string[]) => {
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'losers',
						data
					})
				)
			})
			.on('trigger:volume-5min', (data: string[]) => {
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'volume',
						data
					})
				)
			})
			.on('trigger:funding-5min', (data: string[]) => {
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'funding',
						data
					})
				)
			})
			.on('trigger:gainers-24h', (data: string[]) => {
				dispatch(
					addTriggerEvent({
						timeframe: '24h',
						type: 'gainers',
						data
					})
				)
			})
			.on('trigger:losers-24h', (data: string[]) => {
				dispatch(
					addTriggerEvent({
						timeframe: '24h',
						type: 'losers',
						data
					})
				)
			})

		// Подключаемся к серверу
		wsClient.connect()

		// Отмечаем, что инициализация завершена
		initialized.current = true

		// Очистка при размонтировании
		return () => {
			const client = getWebSocketClient()
			client.disconnect()
		}
	}, [dispatch, handleConnectionChange])

	return null
} 