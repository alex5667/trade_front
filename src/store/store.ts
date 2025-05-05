/**
 * Redux Store
 * ------------------------------
 * Конфигурация хранилища Redux для приложения
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { marketApi } from '@/services/api/market.api'
import { authApi } from '@/services/auth.services'
import { userApi } from '@/services/user.services'
import { collapsedSlice } from './collapsed/collapsed.slice'
import { userSlice } from './user/user.slice'

// Import signal slices
import signalsReducer from './signals/signals.slice'
import connectionReducer from './signals/slices/connection.slice'
import priceChangeReducer from './signals/slices/price-change.slice'
import timeframeReducer from './signals/slices/timeframe.slice'
import triggerReducer from './signals/slices/trigger.slice'
import volatilityReducer from './signals/slices/volatility.slice'
import volumeReducer from './signals/slices/volume.slice'

// Корневой редьюсер, объединяющий все редьюсеры в приложении
const rootReducer = combineReducers({
	[userSlice.reducerPath]: userSlice.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[marketApi.reducerPath]: marketApi.reducer,
	[collapsedSlice.reducerPath]: collapsedSlice.reducer,

	// Signal slices
	connection: connectionReducer,
	volatility: volatilityReducer,
	volume: volumeReducer,
	priceChange: priceChangeReducer,
	timeframe: timeframeReducer,
	trigger: triggerReducer,
	signals: signalsReducer
})

// Конфигурация и создание хранилища
export const store = configureStore({
	reducer: rootReducer,

	// Добавляем middleware для RTK Query
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat([
			userApi.middleware,
			authApi.middleware,
			marketApi.middleware
		])
})

// Настройка слушателей для RTK Query
setupListeners(store.dispatch)

// Экспорт типов
export type TypeRootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
