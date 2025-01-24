export interface DishCategoryResponse {
	id: number,
	name: string,
	slug: string,
	printName: string,
	description?: string,
	createdAt: Date,
	updatedAt: Date,
}

export type DishCategory = Pick<DishCategoryResponse, 'name' | 'printName'>
export type DishCategoryFormState = Partial<Omit<DishCategoryResponse, 'id' | 'createdAt' | 'updatedAt'>>