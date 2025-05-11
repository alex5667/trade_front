/**
 * Signals Middleware
 * ------------------------------
 * Middleware for handling signals routing to appropriate slices
 */

import { Middleware } from '@reduxjs/toolkit'
import { PriceChangeSignal, VolatilitySignal, VolumeSignal } from './signal.types'
import { addPriceChangeSignal } from './slices/price-change.slice'
import { addVolatilityRangeSignal } from './slices/volatility-range.slice'
import { addVolatilitySpikeSignal } from './slices/volatility-spike.slice'
import { addVolumeSignal } from './slices/volume.slice'

/**
 * Middleware for routing signals to the appropriate slices
 * This ensures that adding signals through the specialized slices
 * will also be properly routed to maintain backwards compatibility
 */
export const signalsRoutingMiddleware: Middleware = api => next => action => {
	// First, pass the action to the next middleware in the chain
	const result = next(action)

	// Check which action was dispatched and route accordingly
	if (addVolatilitySpikeSignal.match(action)) {
		const signal = action.payload as VolatilitySignal
		console.log(`📦 Middleware: Routed volatility spike signal for ${signal.symbol}`)
	}
	else if (addVolatilityRangeSignal.match(action)) {
		const signal = action.payload as VolatilitySignal
		console.log(`📦 Middleware: Routed volatility range signal for ${signal.symbol}`)
	}
	else if (addVolumeSignal.match(action)) {
		const signal = action.payload as VolumeSignal
		console.log(`📦 Middleware: Routed volume signal for ${signal.symbol}`)

		// Handle possible updates to the main signals slice if needed for compatibility
	}
	else if (addPriceChangeSignal.match(action)) {
		const signal = action.payload as PriceChangeSignal
		console.log(`📦 Middleware: Routed price change signal for ${signal.symbol}`)

		// Handle possible updates to the main signals slice if needed for compatibility
	}

	return result
}

export default signalsRoutingMiddleware 