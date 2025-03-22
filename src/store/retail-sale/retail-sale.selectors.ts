import { TypeRootState } from '@/store/store'
import { MealConsumptionResponse } from '@/types/mealConsumption.type'
import { createSelector } from 'reselect'

// Базовый селектор для получения всех потреблений
const selectAllMealConsumptions = (state: TypeRootState) => state.mealConsumptionSlice.items

// Базовый селектор для получения всех учреждений
const selectAllInstitutions = (state: TypeRootState) => state.institutionSlice.items

// Фильтрация потребления по дню и типу приема пищи
export const selectFilteredMealConsumptions = (dateForDay: string, mealSlug: string) =>
	createSelector([selectAllMealConsumptions], (items) =>
		items.filter((item: MealConsumptionResponse) =>
			item.date === dateForDay && item.meal?.slug === mealSlug
		)
	)

// Вычисляем общее количество потребления для выбранных фильтров
export const selectTotalQuantity = (dateForDay: string, mealSlug: string) =>
	createSelector([selectFilteredMealConsumptions(dateForDay, mealSlug)], (filteredItems) =>
		filteredItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
	)

// Группируем потребление по учреждениям
export const selectInstitutionsWithConsumption = (dateForDay: string, mealSlug: string) =>
	createSelector([selectAllInstitutions, selectFilteredMealConsumptions(dateForDay, mealSlug)], (institutions, filteredItems) =>
		institutions.map(institution => ({
			...institution,
			consumptionItem: filteredItems.find(item => item.institution?.slug === institution.slug) || undefined
		}))
	)
