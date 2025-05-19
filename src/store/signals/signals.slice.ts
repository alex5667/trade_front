/**
 * Signals Slice
 * ------------------------------
 * Re-exports all signal-related actions needed by mock-signal-generator
 */

// Export connection actions
export { setConnectionStatus } from './slices/connection.slice'

// Export volume actions
export { addVolumeSignal } from './slices/volume.slice'

// Export price change actions
export { addPriceChangeSignal } from './slices/price-change.slice'

// Export volatility actions
export { addVolatilitySignal } from './slices/volatility.slice'

// Export timeframe actions
export {
	addTimeframeGainer,
	addTimeframeLoser
} from './slices/timeframe.slice'
