import { InstitutionResponse } from './institution.type'
import { MealResponse } from './meal.type'

export interface MealConsumptionResponse {
	id?: number,
	createdAt?: string,
	updatedAt?: string | undefined,
	date: string,
	institutionId: number,
	mealId: number,
	quantity: number,
	institution?: InstitutionResponse,
	meal?: MealResponse
}

export type MealFConsumptionFormState = {
	date: string,
	institutionId: number | undefined,
	mealId: number | undefined,
	quantity: number,
}

export type MealConsumptionForm = Omit<MealConsumptionResponse, 'id' | 'createdAt' | 'updatedAt'>

export enum EnumMealConsumptionSort {
	HIGH_QUANTITY = 'high-quantity',
	LOW_QUANTITY = 'low-quantity',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class MealConsumptionDataFilters {

	sort?: EnumMealConsumptionSort | string

	searchTem?: string

	startDate?: string

	endDate?: string


	institutionSlug?: string
	mealSlug?: string

	minQuantity?: string


	maxQuantity?: string

}
