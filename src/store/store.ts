/**
 * Redux Store
 * ------------------------------
 * Конфигурация хранилища Redux для приложения
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { marketApi } from '@/services/api/market.api'
import { authApi } from '@/services/auth.services'
import { signalApi } from '@/services/signal.api'
import { userApi } from '@/services/user.services'
import { collapsedSlice } from './collapsed/collapsed.slice'
import { userSlice } from './user/user.slice'

// Import signal slices
import connectionReducer from './signals/slices/connection.slice'
import fundingReducer from './signals/slices/funding.slice'
import priceChangeReducer from './signals/slices/price-change.slice'
import timeframeReducer from './signals/slices/timeframe.slice'
import triggerReducer from './signals/slices/trigger.slice'
import volatilityRangeReducer from './signals/slices/volatility-range.slice'
import volatilitySpikeReducer from './signals/slices/volatility-spike.slice'
import volatilityReducer from './signals/slices/volatility.slice'
import volumeReducer from './signals/slices/volume.slice'

// Корневой редьюсер, объединяющий все редьюсеры в приложении
const rootReducer = combineReducers({
	[userSlice.reducerPath]: userSlice.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[marketApi.reducerPath]: marketApi.reducer,
	[signalApi.reducerPath]: signalApi.reducer,
	[collapsedSlice.reducerPath]: collapsedSlice.reducer,

	// Signal slices
	connection: connectionReducer,
	funding: fundingReducer,
	volatility: volatilityReducer,
	volatilitySpike: volatilitySpikeReducer,
	volatilityRange: volatilityRangeReducer,
	volume: volumeReducer,
	priceChange: priceChangeReducer,
	timeframe: timeframeReducer,
	trigger: triggerReducer,
})

// Конфигурация и создание хранилища
export const store = configureStore({
	reducer: rootReducer,

	// Добавляем middleware для RTK Query с оптимизированными настройками
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			// Оптимизация для больших состояний
			immutableCheck: {
				warnAfter: 300, // Increased from 128 to reduce warnings with large signal arrays
				ignoreFields: ['createdAt', 'lastUpdated'] // Ignore timestamp fields that change frequently
			},
			serializableCheck: {
				warnAfter: 300, // Increased from 128 to reduce warnings
				// Игнорируем определенные пути в состоянии, которые могут содержать большие объекты
				ignoredPaths: [
					'volatility.signals',
					'volatility.lastUpdated',
					'volatilitySpike.signals',
					'volatilitySpike.lastUpdated',
					'volatilityRange.signals',
					'volatilityRange.lastUpdated',
					'volume.signals',
					'volume.lastUpdated',
					'priceChange.signals',
					'priceChange.lastUpdated',
					'funding.coins',
					'funding.lastUpdated',
					'timeframe',
					'trigger',
					'signals.volatilitySignals',
					'signals.volumeSignals',
					'signals.priceChangeSignals'
				]
			},
		}).concat([
			userApi.middleware,
			authApi.middleware,
			marketApi.middleware,
			signalApi.middleware,
		]),

	// В production режиме отключаем DevTools для оптимизации
	devTools: process.env.NODE_ENV !== 'production'
})

// Настройка слушателей для RTK Query
setupListeners(store.dispatch)

// Экспорт типов
export type TypeRootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
