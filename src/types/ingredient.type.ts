import { IngredientAliasResponse } from './ingredient-alias.type'
import { IngredientSupplier } from './supplier.type'

export interface IngredientResponse {
	id: number
	name: string
	printName: string
	description?: string
	unit?: string
	price?: number | null | string
	isAllergen?: boolean
	createdAt: Date
	updatedAt: Date
	slug: string
	priceUpdatedAt: Date
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

export type IngredientFormState = Partial<Omit<IngredientResponse, 'id' | 'createdAt' | 'updatedAt'>>