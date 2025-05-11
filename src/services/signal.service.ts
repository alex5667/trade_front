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
 * Normalize volatility signal to ensure consistent structure
 * @param signal The original signal to normalize
 * @returns Normalized volatility signal
 */
const normalizeVolatilitySignal = (signal: any): VolatilitySignal => {
	const normalizedSignal = { ...signal }

	// Ensure type is set to 'volatility' for store consistency
	if (signal.type === 'volatilitySpike' || signal.type === 'volatilityRange') {
		normalizedSignal.type = 'volatility'
		normalizedSignal.signalType = signal.type
	}

	// Ensure required fields are present
	if (!normalizedSignal.volatilityChange && normalizedSignal.volatility) {
		normalizedSignal.volatilityChange = 0
	}

	return normalizedSignal as VolatilitySignal
}

// Track processed signals to prevent duplicates
const processedSignals = new Set<string>()

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
		console.log('Signal service: WebSocket connected, updating Redux store')
		dispatch(connected())
		// Clear the processed signals set when reconnecting
		processedSignals.clear()
	})

	client.on('disconnect', () => {
		console.log('Signal service: WebSocket disconnected, updating Redux store')
		dispatch(disconnected())
	})

	client.on('error', (err: Error) => {
		console.error('Signal service: WebSocket error', err)
		dispatch(connectionError(err.message || 'Unknown error'))
	})

	// Generic handler for all volatility signals
	const handleVolatilitySignal = (signal: any) => {
		// Create a unique key for this signal to detect duplicates
		const signalKey = `${signal.type}:${signal.symbol}:${signal.timestamp}`

		// Log the raw incoming signal
		console.log(`📥 Received signal: ${signalKey}`, signal)

		// Skip if we've already processed this exact signal
		if (processedSignals.has(signalKey)) {
			console.log(`🔄 Skipping duplicate signal: ${signalKey}`)
			return
		}

		// Normalize and dispatch the signal
		const normalizedSignal = normalizeVolatilitySignal(signal)
		console.log(`📦 Normalized signal for Redux:`, normalizedSignal)

		// Dispatch to Redux store
		console.log(`📤 Dispatching to Redux store: ${normalizedSignal.symbol}, type: ${normalizedSignal.signalType || 'volatility'}`)
		dispatch(addVolatilitySignal(normalizedSignal))

		// Remember we processed this signal
		processedSignals.add(signalKey)
		console.log(`✅ Added ${signalKey} to processed signals set (size: ${processedSignals.size})`)

		// Limit the size of the processedSignals set
		if (processedSignals.size > 1000) {
			// Clear the oldest entries (first 500)
			const toRemove = Array.from(processedSignals).slice(0, 500)
			toRemove.forEach(key => processedSignals.delete(key))
			console.log(`🧹 Cleaned up processed signals set, removed ${toRemove.length} items`)
		}
	}

	// Volatility signals handlers
	client.on('signal:volatility', handleVolatilitySignal)
	client.on('volatilitySpike', handleVolatilitySignal)
	client.on('volatility', handleVolatilitySignal)
	client.on('signal:volatilityRange', handleVolatilitySignal)
	client.on('volatilityRange', handleVolatilitySignal)

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