import { TypeRootState } from '@/store/store'
import { MealConsumptionResponse } from '@/types/meal-consumption.type'
import { createSelector } from 'reselect'

// Базовый селектор для получения всех потреблений
const selectAllMealConsumptions = (state: TypeRootState) => state.mealConsumptionSlice.items

// Базовый селектор для получения всех учреждений
const selectAllInstitutions = (state: TypeRootState) => state.institutionSlice.items

// Фильтрация потребления по дню и типу приема пищи
export const selectFilteredMealConsumptions = (dateForDay: string, mealId: number) =>
	createSelector([selectAllMealConsumptions], (items) =>
		items.filter((item: MealConsumptionResponse) =>
			item.date === dateForDay && item.mealId === mealId
		)
	)

// Вычисляем общее количество потребления для выбранных фильтров
export const selectTotalQuantity = (dateForDay: string, mealId: number) =>
	createSelector([selectFilteredMealConsumptions(dateForDay, mealId)], (filteredItems) =>
		filteredItems.reduce((acc, curr) => acc + (curr.quantity || 0), 0)
	)

// Группируем потребление по учреждениям
export const selectInstitutionsWithConsumption = (dateForDay: string, mealId: number) =>
	createSelector([selectAllInstitutions, selectFilteredMealConsumptions(dateForDay, mealId)], (institutions, filteredItems) =>
		institutions.map(institution => ({
			...institution,
			consumptionItem: filteredItems.find(item => item.institution?.id === institution.id) || undefined
		}))
	)
