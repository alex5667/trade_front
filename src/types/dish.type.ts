import { DishAliasResponse } from './dish-alias.type'
import { DishCategoryResponse } from './dishCategory.type'
import { DishIngredient, IngredientDto } from './ingredient.type'

export interface DishResponse {
	id: number
	name: string
	printName: string | ''
	description?: string
	price?: number | string
	category?: DishCategoryResponse
	createdAt?: string
	updatedAt?: string
	preparationSteps?: unknown | null
	slug: string
	ingredients: DishIngredient[]
	dishPhotos: DishPhoto[]
	aliases: DishAliasResponse[]
	isSemiFinished: boolean

}

interface DishPhoto {
	id: number
	url: string

}




export interface DishDto extends Omit<DishResponse, 'ingredients'> {
	ingredients: IngredientDto[]
}

export type DishResponseKeys = keyof DishResponse
export type DishFormState = Pick<DishResponse, 'name' | 'printName'> & Partial<Omit<DishResponse, 'name' | 'printName'>>
export type DishResponsePartial = Partial<DishResponse>