import { EnumMenuSort } from './menuItem.type'



export interface PurchasingResponse {
	nullableIngredientsInDishes: string[]
	totalIngredientByWeek?: PurchasingsAggregate
	weekDishes: PurchasingData
}



export type IngredientStats = {
	grossWeight: number
	coast: number
	quantity: number
}

export type DailyPurchasingData = {
	[ingredientName: string]: IngredientStats
}

export type WeeklyPurchasingData = {
	[ingredientName: string]: IngredientStats
}

export type PurchasingsAggregate = {
	dates: {
		[date: string]: DailyPurchasingData
	}
	week: WeeklyPurchasingData
}




export type PurshaingDataFilters = {
	sort?: EnumMenuSort | string
	searchTerm?: string
	minPrice?: string
	maxPrice?: string
	startDate?: string
	endDate?: string
	startDateForCalculation?: string
	endDateForCalculation?: string
	institutionSlug?: string

}

export type Ingredient = {
	id: number
	unit: string
	price: string
	grossWeight: string
	coast: string
	quantity: number
}

export type InstitutionData = Record<string, Ingredient[] | Record<string, never>>

export type MealData = Record<string, InstitutionData>

export type PurchasingData = Record<string, MealData>
