export interface DishCategoryResponse {
	id: number,
	name: string,
	slug: string,
	printName: string | null,
	description?: string | null,
	createdAt: Date,
	updatedAt: Date,
}

export type DishCategory = Pick<DishCategoryResponse, 'name' | 'printName'>