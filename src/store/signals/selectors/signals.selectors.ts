/**
 * Signal Selectors
 * ------------------------------
 * Селекторы для доступа к данным сигналов из хранилища Redux
 * Позволяют получать определенные части состояния для компонентов
 */

import { TypeRootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

export const selectVolatilityState = (state: TypeRootState) => state.volatility
export const selectVolatilitySpikeState = (state: TypeRootState) => state.volatilitySpike
export const selectVolatilityRangeState = (state: TypeRootState) => state.volatilityRange
export const selectVolumeState = (state: TypeRootState) => state.volume
export const selectPriceChangeState = (state: TypeRootState) => state.priceChange
export const selectConnectionState = (state: TypeRootState) => state.connection
export const selectTimeframeState = (state: TypeRootState) => state.timeframe
export const selectTriggerState = (state: TypeRootState) => state.trigger
export const selectFundingState = (state: TypeRootState) => state.funding

export const selectVolatilitySignals = (state: TypeRootState) => state.volatility?.signals || []
export const selectVolatilitySpikeSignals = (state: TypeRootState) => state.volatilitySpike?.signals || []
export const selectVolatilityRangeSignals = (state: TypeRootState) => state.volatilityRange?.signals || []

export const selectVolatilityLastUpdated = (state: TypeRootState) => state.volatility?.lastUpdated || 0
export const selectVolatilitySpikeLastUpdated = (state: TypeRootState) => state.volatilitySpike?.lastUpdated || 0
export const selectVolatilityRangeLastUpdated = (state: TypeRootState) => state.volatilityRange?.lastUpdated || 0

export const selectConnectionStatus = (state: TypeRootState) => state.connection?.isConnected || false
export const selectConnectionError = (state: TypeRootState) => state.connection?.lastError || null

export const selectVolumeSignals = (state: TypeRootState) => state.volume?.signals || []
export const selectPriceChangeSignals = (state: TypeRootState) => state.priceChange?.signals || []

export const selectCombinedVolatilitySignals = createSelector(
	[selectVolatilitySpikeSignals, selectVolatilityRangeSignals],
	(spikeSignals, rangeSignals) => {
		const toNumber = (v: unknown): number => {
			if (typeof v === 'number') return v
			if (typeof v === 'string') {
				const ms = Date.parse(v)
				return isNaN(ms) ? 0 : ms
			}
			return 0
		}
		return [...spikeSignals, ...rangeSignals].sort((a: any, b: any) => toNumber(b.timestamp as any) - toNumber(a.timestamp as any))
	}
)

export const selectTopGainers = (state: TypeRootState) => state.timeframe?.gainers || []
export const selectTopLosers = (state: TypeRootState) => state.timeframe?.losers || []

export const selectTriggerGainers = (state: TypeRootState) => state.trigger?.gainers || []
export const selectTriggerLosers = (state: TypeRootState) => state.trigger?.losers || []

export const selectTimeframeData = createSelector([selectTopGainers, selectTopLosers], (gainers, losers) => ({ gainers, losers }))
export const selectTimeframeTriggers = createSelector([selectTriggerGainers, selectTriggerLosers], (gainers, losers) => ({ gainers, losers }))

export const selectFundingData = (state: TypeRootState) => state.funding?.coins || [] 