export interface DishCategoryResponse {
	id: number,
	name: string,
	slug: string,
	printName: string,
	description?: string,
	createdAt: string,
	updatedAt: string,
}

export type DishCategory = Pick<DishCategoryResponse, 'name' | 'printName'>
export type DishCategoryFormState = Partial<DishCategoryResponse>