import { DishCategoryResponse } from './dishCategory.type'

export interface DishResponse {
	id: number
	name: string
	printName: string | ''
	description?: string | null
	price?: number | null
	category?: DishCategoryResponse
	createdAt?: Date
	updatedAt?: Date
	slug: string
}


export interface Ingredient {
	id: number
	name: string
	printName: string
	description?: string
	unit?: string
	price?: number
	isAllergen?: boolean
	createdAt: Date
	updatedAt: Date
}

export interface DishIngredient {
	grossWeight?: number
	coldLossPercent?: number
	heatLossPercent?: number
	ingredient?: Ingredient
}

export interface DishResponse {
	id: number
	name: string
	printName: string | ''
	description?: string | null
	price?: number | null
	category?: DishCategoryResponse
	createdAt?: Date
	updatedAt?: Date
	preparationSteps?: unknown | null
	slug: string
	ingredients: DishIngredient[]
}



export type DishResponseKeys = keyof DishResponse
export type DishFormState = Pick<DishResponse, 'name' | 'printName' | 'category'> & Partial<Omit<DishResponse, 'name' | 'printName' | 'category'>>
