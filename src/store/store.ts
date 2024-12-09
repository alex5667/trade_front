import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import { filterSlice } from './filters/filters.slice'


import { authApi } from '@/services/auth.services'
import { dishApi } from '@/services/dish.service'
import { institutionApi } from '@/services/institution.service'
import { mealConsumptionApi } from '@/services/meal-consumption.service'
import { mealApi } from '@/services/meal.service'
import { menuItemApi } from '@/services/menu-item.service'
import { userApi } from '@/services/user.services'
import { collapsedSlice } from './collapsed/collapsed.slice'
import { dishSlice } from './dish/dish.slice'
import { institutionSlice } from './institution/institution.slice'
import { mealSlice } from './meal/meal.slice'
import { mealConsumptionSlice } from './mealConsumption/meal-consumption.slice'
import { menuItemSlice } from './menuItem/menu-item.slice'
import { sidebarSlice } from './sidebar/sidebar.slice'
import { userSlice } from './user/user.slice'

const rootReducer = combineReducers({
	[userSlice.reducerPath]: userSlice.reducer,
	[userApi.reducerPath]: userApi.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[menuItemApi.reducerPath]: menuItemApi.reducer,
	[collapsedSlice.reducerPath]: collapsedSlice.reducer,
	[mealConsumptionSlice.reducerPath]: mealConsumptionSlice.reducer,
	[menuItemSlice.reducerPath]: menuItemSlice.reducer,
	[mealSlice.reducerPath]: mealSlice.reducer,
	[institutionSlice.reducerPath]: institutionSlice.reducer,
	[mealApi.reducerPath]: mealApi.reducer,
	[dishApi.reducerPath]: dishApi.reducer,
	[institutionApi.reducerPath]: institutionApi.reducer,
	[mealConsumptionApi.reducerPath]: mealConsumptionApi.reducer,
	[sidebarSlice.reducerPath]: sidebarSlice.reducer,
	[dishSlice.reducerPath]: dishSlice.reducer,

})

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}).concat(
			menuItemApi.middleware,

			userApi.middleware,
			authApi.middleware,
			dishApi.middleware,
			institutionApi.middleware,
			mealApi.middleware,
			mealConsumptionApi.middleware

		)
})

export type TypeRootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
