import { combineReducers, configureStore } from '@reduxjs/toolkit'


import { authApi } from '@/services/auth.services'

import { userApi } from '@/services/user.services'
import { collapsedSlice } from './collapsed/collapsed.slice'

import { userSlice } from './user/user.slice'

const rootReducer = combineReducers({
	[userSlice.reducerPath]: userSlice.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[collapsedSlice.reducerPath]: collapsedSlice.reducer,


})

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}).concat(
			userApi.middleware,
			authApi.middleware,

		)
})

export type TypeRootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
