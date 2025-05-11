/**
 * Signal Selectors
 * ------------------------------
 * Селекторы для доступа к данным сигналов из хранилища Redux
 * Позволяют получать определенные части состояния для компонентов
 */

import { TypeRootState } from '@/store/store'
import { createSelector } from '@reduxjs/toolkit'

// Базовые селекторы для доступа к состоянию каждого слайса
export const selectVolatilityState = (state: TypeRootState) => state.volatility
export const selectVolatilitySpikeState = (state: TypeRootState) => state.volatilitySpike
export const selectVolatilityRangeState = (state: TypeRootState) => state.volatilityRange
export const selectVolumeState = (state: TypeRootState) => state.volume
export const selectPriceChangeState = (state: TypeRootState) => state.priceChange
export const selectConnectionState = (state: TypeRootState) => state.connection
export const selectTimeframeState = (state: TypeRootState) => state.timeframe
export const selectTriggerState = (state: TypeRootState) => state.trigger
export const selectFundingState = (state: TypeRootState) => state.funding || []

// Селекторы сигналов волатильности
export const selectVolatilitySignals = (state: TypeRootState) =>
	state.volatility?.signals || []

// Специализированные селекторы для разных типов волатильности
export const selectVolatilitySpikeSignals = (state: TypeRootState) =>
	state.volatilitySpike?.signals || []

export const selectVolatilityRangeSignals = (state: TypeRootState) =>
	state.volatilityRange?.signals || []

// Селекторы для получения последнего обновления
export const selectVolatilityLastUpdated = (state: TypeRootState) =>
	state.volatility?.lastUpdated || 0

export const selectVolatilitySpikeLastUpdated = (state: TypeRootState) =>
	state.volatilitySpike?.lastUpdated || 0

export const selectVolatilityRangeLastUpdated = (state: TypeRootState) =>
	state.volatilityRange?.lastUpdated || 0

// Селектор статуса подключения
export const selectConnectionStatus = (state: TypeRootState) =>
	state.connection?.isConnected || false

export const selectConnectionError = (state: TypeRootState) =>
	state.connection?.lastError || null

// Селекторы сигналов объема
export const selectVolumeSignals = (state: TypeRootState) =>
	state.volume?.signals || []

// Селекторы сигналов изменения цены
export const selectPriceChangeSignals = (state: TypeRootState) =>
	state.priceChange?.signals || []

// Комбинированный селектор для всех типов волатильности
export const selectCombinedVolatilitySignals = createSelector(
	[selectVolatilitySpikeSignals, selectVolatilityRangeSignals],
	(spikeSignals, rangeSignals) => {
		// Combine and sort by timestamp (newest first)
		return [...spikeSignals, ...rangeSignals]
			.sort((a, b) => b.timestamp - a.timestamp)
	}
)

// Селекторы таймфреймов - 5 минут
export const selectTopGainers5min = (state: TypeRootState) =>
	state.timeframe?.['5min']?.gainers || []

export const selectTopLosers5min = (state: TypeRootState) =>
	state.timeframe?.['5min']?.losers || []

export const selectTopVolume5min = (state: TypeRootState) =>
	state.timeframe?.['5min']?.volume || []

export const selectTopFunding5min = (state: TypeRootState) =>
	state.funding?.coins || []

// Селекторы таймфреймов - 24 часа
export const selectTopGainers24h = (state: TypeRootState) =>
	state.timeframe?.['24h']?.gainers || []

export const selectTopLosers24h = (state: TypeRootState) =>
	state.timeframe?.['24h']?.losers || []

// Селекторы триггеров
export const selectTriggerGainers5min = (state: TypeRootState) =>
	state.trigger?.['5min']?.gainers || []

export const selectTriggerLosers5min = (state: TypeRootState) =>
	state.trigger?.['5min']?.losers || []

export const selectTriggerVolume5min = (state: TypeRootState) =>
	state.trigger?.['5min']?.volume || []

export const selectTriggerFunding5min = (state: TypeRootState) =>
	state.trigger?.['5min']?.funding || []

export const selectTriggerGainers24h = (state: TypeRootState) =>
	state.trigger?.['24h']?.gainers || []

export const selectTriggerLosers24h = (state: TypeRootState) =>
	state.trigger?.['24h']?.losers || []

// Мемоизированные селекторы для часто используемых комбинаций данных
/**
 * Сгруппированные данные для таймфрейма 5 минут
 * Включает растущие, падающие, объём и финансирование
 */
export const selectTimeframe5minData = createSelector(
	[
		selectTopGainers5min,
		selectTopLosers5min,
		selectTopVolume5min,
		selectTopFunding5min
	],
	(gainers, losers, volume, funding) => ({
		gainers,
		losers,
		volume,
		funding
	})
)

/**
 * Сгруппированные данные для таймфрейма 24 часа
 * Включает только растущие и падающие монеты
 */
export const selectTimeframe24hData = createSelector(
	[
		selectTopGainers24h,
		selectTopLosers24h
	],
	(gainers, losers) => ({
		gainers,
		losers
	})
)

/**
 * Сгруппированные данные триггеров для таймфрейма 5 минут
 * Используются для обновления UI при получении новых сигналов
 */
export const selectTrigger5minData = createSelector(
	[
		selectTriggerGainers5min,
		selectTriggerLosers5min,
		selectTriggerVolume5min,
		selectTriggerFunding5min
	],
	(gainers, losers, volume, funding) => ({
		gainers,
		losers,
		volume,
		funding
	})
)

/**
 * Сгруппированные данные триггеров для таймфрейма 24 часа
 * Используются для обновления UI при получении новых сигналов
 */
export const selectTrigger24hData = createSelector(
	[
		selectTriggerGainers24h,
		selectTriggerLosers24h
	],
	(gainers, losers) => ({
		gainers,
		losers
	})
)

/**
 * Селектор для получения всех данных о таймфреймах и триггерах
 * Используется для централизованного доступа ко всем данным
 */
export const selectTimeframeData = createSelector(
	[selectTimeframe5minData, selectTimeframe24hData],
	(data5min, data24h) => ({
		'5min': data5min,
		'24h': data24h
	})
)

/**
 * Селектор для получения всех триггеров
 */
export const selectTimeframeTriggers = createSelector(
	[selectTrigger5minData, selectTrigger24hData],
	(triggers5min, triggers24h) => ({
		'5min': triggers5min,
		'24h': triggers24h
	})
)

/**
 * Селектор для получения данных о финансировании
 */
export const selectFundingData = createSelector(
	[selectTopFunding5min],
	(funding) => funding
) 