'use strict'

export interface DishAliasResponse {
	id: number
	alias: string
	dishId: number
}
export type DishAliasFormState = Partial<DishAliasResponse>