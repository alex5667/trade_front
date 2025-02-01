export type SupplierResponse = {
	id: number
	name: string
	contactPerson?: string
	phone?: string
	email?: string
	address?: string
	website?: string
	createdAt: string
	updatedAt: string
}


export type IngredientSupplier = {
	id: number
	price?: number
	deliveryTime?: number
	minOrderQty?: number
	productUrl?: string
	supplier?: SupplierResponse
}
