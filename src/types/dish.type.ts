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
export type DishFormState = Pick<DishResponse, 'name' | 'printName' | 'category'>