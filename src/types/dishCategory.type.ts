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
export type DishCategoryFormState = Pick<DishCategoryResponse, 'name' | 'printName'> & Partial<Omit<DishCategoryResponse, 'name' | 'printName'>>
export type DishCategoryResponsePartial = Partial<DishCategoryResponse>