import { DishCategoryResponse } from './dishCategory.type'
import { DishIngredient, IngredientDto } from './ingredient.type'

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




export interface DishDto extends Omit<DishResponse, 'ingredients'> {
	ingredients: IngredientDto[]
}

export type DishResponseKeys = keyof DishResponse
export type DishFormState = Pick<DishResponse, 'name' | 'printName' | 'category'> & Partial<Omit<DishResponse, 'name' | 'printName' | 'category'>>
