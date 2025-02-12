import { combineReducers, configureStore } from '@reduxjs/toolkit'


import { authApi } from '@/services/auth.services'
import { dishCategoryApi } from '@/services/dish-category.service'
import { dishApi } from '@/services/dish.service'
import { ingredientAliasApi } from '@/services/ingredient-alias.service'
import { ingredientApi } from '@/services/ingredient.service'
import { institutionApi } from '@/services/institution.service'
import { mealConsumptionApi } from '@/services/meal-consumption.service'
import { mealApi } from '@/services/meal.service'
import { menuItemApi } from '@/services/menu-item.service'
import { purchasingApi } from '@/services/purchasing.service'
import { userApi } from '@/services/user.services'
import { collapsedSlice } from './collapsed/collapsed.slice'
import { dishCategorySlice } from './dish-category/dishCategory.slice'
import { dishSlice } from './dish/dish.slice'
import { ingredientAliasSlice } from './ingredient-alias/ingredient-alias.slice'
import { ingredientSlice } from './ingredient/ingredient.slice'
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
	[dishCategoryApi.reducerPath]: dishCategoryApi.reducer,
	[institutionApi.reducerPath]: institutionApi.reducer,
	[mealConsumptionApi.reducerPath]: mealConsumptionApi.reducer,
	[sidebarSlice.reducerPath]: sidebarSlice.reducer,
	[dishSlice.reducerPath]: dishSlice.reducer,
	[dishCategorySlice.reducerPath]: dishCategorySlice.reducer,
	[ingredientSlice.reducerPath]: ingredientSlice.reducer,
	[ingredientApi.reducerPath]: ingredientApi.reducer,
	[ingredientAliasApi.reducerPath]: ingredientAliasApi.reducer,
	[ingredientAliasSlice.reducerPath]: ingredientAliasSlice.reducer,
	[purchasingApi.reducerPath]: purchasingApi.reducer,


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
			dishCategoryApi.middleware,
			institutionApi.middleware,
			mealApi.middleware,
			mealConsumptionApi.middleware,
			ingredientApi.middleware,
			ingredientAliasApi.middleware,
			purchasingApi.middleware,

		)
})

export type TypeRootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
