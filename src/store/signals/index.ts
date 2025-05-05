/**
 * Signal Module Index
 * ------------------------------
 * Exports all signal-related Redux slices, selectors and types
 */

// Export all signal-related slices
export { default as connectionReducer } from './slices/connection.slice'
export { default as priceChangeReducer } from './slices/price-change.slice'
export { default as timeframeReducer } from './slices/timeframe.slice'
export { default as triggerReducer } from './slices/trigger.slice'
export { default as volatilityReducer } from './slices/volatility.slice'
export { default as volumeReducer } from './slices/volume.slice'

// Export actions from connection slice
export {
	connected, connecting, connectionError, disconnected
} from './slices/connection.slice'

// Export actions from volatility slice
export {
	addVolatilitySignal,
	clearVolatilitySignals
} from './slices/volatility.slice'

// Export actions from volume slice
export {
	addVolumeSignal,
	clearVolumeSignals
} from './slices/volume.slice'

// Export actions from price change slice
export {
	addPriceChangeSignal,
	clearPriceChangeSignals
} from './slices/price-change.slice'

// Export actions from timeframe slice
export {
	setTopFunding5min,
	setTopGainers24h, setTopGainers5min, setTopLosers24h, setTopLosers5min,
	setTopVolume5min
} from './slices/timeframe.slice'

// Export actions from trigger slice
export {
	setTriggerFunding5min,
	setTriggerGainers24h, setTriggerGainers5min, setTriggerLosers24h, setTriggerLosers5min,
	setTriggerVolume5min
} from './slices/trigger.slice'

// Export selectors
export * from './selectors/signals.selectors'

// Export types
export * from './signal.types'
