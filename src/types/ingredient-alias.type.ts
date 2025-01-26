export interface IngredientAliasResponse {
	id: number
	alias: string
	ingredientId: number
}
export type IngredientAliasFormState = Partial<Omit<IngredientAliasResponse, 'id'>>