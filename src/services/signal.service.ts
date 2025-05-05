'use client'

/**
 * Signal Service
 * ------------------------------
 * Service that manages WebSocket connection and dispatches
 * received signals to Redux store
 */

import {
	AnyObject,
	PriceChangeSignal,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'
import {
	connected,
	connecting,
	connectionError,
	disconnected
} from '@/store/signals/slices/connection.slice'
import { addPriceChangeSignal } from '@/store/signals/slices/price-change.slice'
import {
	setTopFunding5min,
	setTopGainers24h,
	setTopGainers5min,
	setTopLosers24h,
	setTopLosers5min,
	setTopVolume5min
} from '@/store/signals/slices/timeframe.slice'
import {
	setTriggerFunding5min,
	setTriggerGainers24h,
	setTriggerGainers5min,
	setTriggerLosers24h,
	setTriggerLosers5min,
	setTriggerVolume5min
} from '@/store/signals/slices/trigger.slice'
import { addVolatilitySignal } from '@/store/signals/slices/volatility.slice'
import { addVolumeSignal } from '@/store/signals/slices/volume.slice'
import {
	parseFundingCoins,
	parseSymbols,
	parseTimeframeCoins,
	parseVolumeCoins
} from '@/store/signals/utils/signal-parsers'
import { AppDispatch } from '@/store/store'
import { getWebSocketClient } from './websocket.service'

/**
 * Initialize the WebSocket connection and set up event handlers
 * to dispatch actions to the Redux store
 */
export const initializeSignalService = (dispatch: AppDispatch) => {
	const client = getWebSocketClient()

	// Dispatch connection status actions
	dispatch(connecting())

	// Connection status handlers
	client.on('connect', () => {
		dispatch(connected())
	})

	client.on('disconnect', () => {
		dispatch(disconnected())
	})

	client.on('error', (err: Error) => {
		dispatch(connectionError(err.message || 'Unknown error'))
	})

	// Volatility signals handlers
	client.on('signal:volatility', (signal: VolatilitySignal) => {
		dispatch(addVolatilitySignal(signal))
	})

	client.on('volatilitySpike', (signal: VolatilitySignal) => {
		dispatch(addVolatilitySignal(signal))
	})

	client.on('volatility', (signal: VolatilitySignal) => {
		dispatch(addVolatilitySignal(signal))
	})

	client.on('signal:volatilityRange', (signal: VolatilitySignal) => {
		dispatch(addVolatilitySignal(signal))
	})

	client.on('volatilityRange', (signal: VolatilitySignal) => {
		dispatch(addVolatilitySignal(signal))
	})

	// Volume signal handlers
	client.on('volumeSpike', (signal: VolumeSignal) => {
		dispatch(addVolumeSignal(signal))
	})

	// Price change signal handlers
	client.on('priceChange', (signal: PriceChangeSignal) => {
		dispatch(addPriceChangeSignal(signal))
	})

	// 5min timeframe handlers
	client.on('top:gainers:5min', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		dispatch(setTopGainers5min(coins))
	})

	client.on('top:losers:5min', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		dispatch(setTopLosers5min(coins))
	})

	client.on('top:volume:5min', (data: AnyObject) => {
		const coins = parseVolumeCoins(data)
		dispatch(setTopVolume5min(coins))
	})

	client.on('top:funding:5min', (data: AnyObject) => {
		const coins = parseFundingCoins(data)
		dispatch(setTopFunding5min(coins))
	})

	// 24h timeframe handlers
	client.on('top:gainers:24h', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		dispatch(setTopGainers24h(coins))
	})

	client.on('top:losers:24h', (data: AnyObject) => {
		const coins = parseTimeframeCoins(data)
		dispatch(setTopLosers24h(coins))
	})

	// Trigger handlers
	client.on('trigger:gainers-5min', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(setTriggerGainers5min(symbols))
	})

	client.on('trigger:losers-5min', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(setTriggerLosers5min(symbols))
	})

	client.on('trigger:volume-5min', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(setTriggerVolume5min(symbols))
	})

	client.on('trigger:funding-5min', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(setTriggerFunding5min(symbols))
	})

	client.on('trigger:gainers-24h', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(setTriggerGainers24h(symbols))
	})

	client.on('trigger:losers-24h', (data: AnyObject) => {
		const symbols = parseSymbols(data)
		dispatch(setTriggerLosers24h(symbols))
	})

	// Connect to the WebSocket server
	client.connect()

	// Return cleanup function
	return () => {
		client.disconnect()
	}
}

/**
 * Get the current WebSocket connection status
 */
export const getConnectionStatus = () => {
	const client = getWebSocketClient()
	return client.isActive() ? 'connected' : 'disconnected'
} 