import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import { filterSlice } from './filters/filters.slice'


import { menuItemApi } from '@/services/menu-item.service'
import { userApi } from '@/services/user.services'
import { userSlice } from './user/user.slice'

const rootReducer = combineReducers({
	[userSlice.reducerPath]: userSlice.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[menuItemApi.reducerPath]: menuItemApi.reducer,

})

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(
			menuItemApi.middleware,
			userApi.middleware

		)
})

export type TypeRootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
