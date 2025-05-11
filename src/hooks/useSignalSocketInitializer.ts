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

import { errorCatch } from '@/api/error'
import { getWebSocketClient } from '@/services/websocket.service'
import {
	FundingCoin,
	PriceChangeSignal,
	TimeframeCoin,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'

// Import actions from specialized slices
import {
	setConnectionError,
	setConnectionStatus
} from '@/store/signals/slices/connection.slice'
import {
	addFundingData
} from '@/store/signals/slices/funding.slice'
import {
	addPriceChangeSignal
} from '@/store/signals/slices/price-change.slice'
import {
	addTimeframeGainer,
	addTimeframeLoser,
	addTimeframeVolume
} from '@/store/signals/slices/timeframe.slice'
import {
	addTriggerEvent
} from '@/store/signals/slices/trigger.slice'
import {
	addVolatilityRangeSignal
} from '@/store/signals/slices/volatility-range.slice'
import {
	addVolatilitySpikeSignal
} from '@/store/signals/slices/volatility-spike.slice'
import {
	addVolumeSignal
} from '@/store/signals/slices/volume.slice'

/**
 * Хук для инициализации WebSocket соединения и настройки обработчиков сигналов
 * Отвечает за подключение к серверу и распределение получаемых сигналов по Redux-стору
 */
export const useSignalSocketInitializer = () => {
	const dispatch = useDispatch()
	const initialized = useRef(false)
	const connectionAttempts = useRef(0)
	const maxRetries = useRef(5)

	// Обработчик изменения статуса соединения
	const handleConnectionChange = useCallback(
		(isConnected: boolean) => {
			console.log(`WebSocket connection status changed: ${isConnected ? 'connected' : 'disconnected'}`)
			dispatch(setConnectionStatus(isConnected))
		},
		[dispatch]
	)

	// Функция для инициализации WebSocket соединения
	const initializeSocketConnection = useCallback(() => {
		console.log('Initializing WebSocket connection...')
		const wsClient = getWebSocketClient()

		// Настраиваем обработчики событий
		wsClient
			// События подключения/отключения
			.on('connect', () => {
				console.log('WebSocket connected successfully')
				handleConnectionChange(true)
			})
			.on('disconnect', () => {
				console.log('WebSocket disconnected')
				handleConnectionChange(false)

				// Try to reconnect if disconnected and under max retries
				if (connectionAttempts.current < maxRetries.current) {
					connectionAttempts.current += 1
					console.log(`Attempting reconnection ${connectionAttempts.current}/${maxRetries.current}...`)
					setTimeout(() => {
						wsClient.connect()
					}, 3000)
				} else {
					dispatch(setConnectionError('Превышено максимальное число попыток подключения'))
				}
			})
			.on('error', (error: unknown) => {
				const errorMessage = errorCatch(error)
				console.error('WebSocket error:', errorMessage)
				dispatch(setConnectionError(errorMessage))
				handleConnectionChange(false)
			})

			// Volatility signals by type
			.on('signal:volatility', (data: VolatilitySignal) => {
				console.log('Received signal:volatility:', data)
				// Route based on signal type or structure
				if (data.signalType === 'volatilitySpike') {
					dispatch(addVolatilitySpikeSignal(data))
				} else if (data.signalType === 'volatilityRange') {
					dispatch(addVolatilityRangeSignal(data))
				} else if (data.range !== undefined && data.avgRange !== undefined) {
					// Looks like a range signal
					dispatch(addVolatilityRangeSignal({
						...data,
						signalType: 'volatilityRange'
					}))
				} else {
					// Default to spike
					dispatch(addVolatilitySpikeSignal({
						...data,
						signalType: 'volatilitySpike'
					}))
				}
			})
			.on('volatilitySpike', (data: VolatilitySignal) => {
				console.log('Received volatilitySpike:', data)
				dispatch(addVolatilitySpikeSignal({
					...data,
					signalType: 'volatilitySpike'
				}))
			})
			.on('volatilityRange', (data: VolatilitySignal) => {
				console.log('Received volatilityRange:', data)
				dispatch(addVolatilityRangeSignal({
					...data,
					signalType: 'volatilityRange'
				}))
			})

			// Volume signals
			.on('volumeSpike', (data: VolumeSignal) => {
				console.log('Received volume spike:', data)
				dispatch(addVolumeSignal(data))
			})

			// Price change signals
			.on('priceChange', (data: PriceChangeSignal) => {
				console.log('Received price change:', data)
				dispatch(addPriceChangeSignal(data))
			})

			// Top gainers/losers for 5min timeframe
			.on('top:gainers:5min', (data: TimeframeCoin) => {
				console.log('Received top gainers 5min:', data)
				dispatch(addTimeframeGainer({ timeframe: '5min', data }))
			})
			.on('top:losers:5min', (data: TimeframeCoin) => {
				console.log('Received top losers 5min:', data)
				dispatch(addTimeframeLoser({ timeframe: '5min', data }))
			})
			.on('top:volume:5min', (data: VolumeSignal) => {
				console.log('Received top volume 5min:', data)
				dispatch(addTimeframeVolume({ timeframe: '5min', data }))
			})
			.on('top:funding:5min', (data: FundingCoin) => {
				console.log('Received top funding 5min:', data)
				dispatch(addFundingData({ data }))
			})

			// Top gainers/losers for 24h timeframe
			.on('top:gainers:24h', (data: TimeframeCoin) => {
				console.log('Received top gainers 24h:', data)
				dispatch(addTimeframeGainer({ timeframe: '24h', data }))
			})
			.on('top:losers:24h', (data: TimeframeCoin) => {
				console.log('Received top losers 24h:', data)
				dispatch(addTimeframeLoser({ timeframe: '24h', data }))
			})

			// Trigger events (special events for UI updates)
			.on('trigger:gainers-5min', (data: string[]) => {
				console.log('Received trigger gainers 5min:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'gainers',
						data
					})
				)
			})
			.on('trigger:losers-5min', (data: string[]) => {
				console.log('Received trigger losers 5min:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'losers',
						data
					})
				)
			})
			.on('trigger:volume-5min', (data: string[]) => {
				console.log('Received trigger volume 5min:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'volume',
						data
					})
				)
			})
			.on('trigger:funding-5min', (data: string[]) => {
				console.log('Received trigger funding 5min:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '5min',
						type: 'funding',
						data
					})
				)
			})
			.on('trigger:gainers-24h', (data: string[]) => {
				console.log('Received trigger gainers 24h:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '24h',
						type: 'gainers',
						data
					})
				)
			})
			.on('trigger:losers-24h', (data: string[]) => {
				console.log('Received trigger losers 24h:', data)
				dispatch(
					addTriggerEvent({
						timeframe: '24h',
						type: 'losers',
						data
					})
				)
			})

		// Connect to the server
		try {
			wsClient.connect()
		} catch (error: unknown) {
			const errorMessage = errorCatch(error)
			console.error('Failed to initialize WebSocket connection:', errorMessage)
			dispatch(setConnectionError(errorMessage))
		}

		// Mark initialization as complete
		initialized.current = true

		return wsClient
	}, [dispatch, handleConnectionChange])

	// Initialize WebSocket connection
	useEffect(() => {
		// Don't initialize twice
		if (initialized.current) return

		const wsClient = initializeSocketConnection()

		// Cleanup on unmount
		return () => {
			console.log('Cleaning up WebSocket connection')
			try {
				wsClient.disconnect()
			} catch (error: unknown) {
				console.error('Error during WebSocket disconnect:', errorCatch(error))
			}
		}
	}, [dispatch, handleConnectionChange, initializeSocketConnection])

	return null
} 