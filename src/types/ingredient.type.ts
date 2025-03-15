import { IngredientAliasResponse } from './ingredient-alias.type'
import { IngredientSupplier } from './supplier.type'

export interface IngredientResponse {
	id: number
	name: string
	printName: string
	description?: string
	unit?: string
	price?: number | string
	isAllergen?: boolean
	createdAt: string
	updatedAt: string
	slug: string
	priceUpdatedAt: string
	aliases: IngredientAliasResponse[]
	suppliers: IngredientSupplier[]

}

export interface DishIngredient {
	grossWeight?: number
	coldLossPercent?: number
	heatLossPercent?: number
	ingredient?: IngredientResponse
}
export interface IngredientDto {
	ingredientId: number
	grossWeight: number
	coldLossPercent?: number
	heatLossPercent?: number
}

export type IngredientFormState = Pick<IngredientResponse, 'name' | 'printName'> & Partial<Omit<IngredientResponse, 'name' | 'printName'>>
export type IngredientResponsePartial = Partial<IngredientResponse>