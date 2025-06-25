/**
 * Signals Module Index
 * ------------------------------
 * Exports all signal-related redux functionality
 */

// Export signal types
export * from './signal.types'

// Export slice reducers
export { default as connectionReducer } from './slices/connection.slice'
export { default as priceChangeReducer } from './slices/price-change.slice'
export { default as timeframeReducer } from './slices/timeframe.slice'
export { default as triggerReducer } from './slices/trigger.slice'
export { default as volatilityRangeReducer } from './slices/volatility-range.slice'
export { default as volatilitySpikeReducer } from './slices/volatility-spike.slice'
export { default as volatilityReducer } from './slices/volatility.slice'
export { default as volumeReducer } from './slices/volume.slice'

// Export specialized slice actions for volatility
export {
	addVolatilitySignal as addVolatilityGenericSignal,
	clearVolatilitySignals as clearVolatilityGenericSignals
} from './slices/volatility.slice'

export {
	addVolatilitySpikeSignal,
	clearVolatilitySpikeSignals
} from './slices/volatility-spike.slice'

export {
	addVolatilityRangeSignal,
	clearVolatilityRangeSignals
} from './slices/volatility-range.slice'

// Export specialized slice actions for volume and price change
export {
	addVolumeSignal,
	clearVolumeSignals
} from './slices/volume.slice'

export {
	addPriceChangeSignal,
	clearPriceChangeSignals
} from './slices/price-change.slice'

// Export selectors
export * from './selectors/signals.selectors'
