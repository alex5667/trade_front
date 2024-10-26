export interface DishCategoryResponse {
	id: 'id',
	name: 'name',
	printName: 'printName',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
	slug: 'slug'
}

export type DishCategory = Pick<DishCategoryResponse, 'name' | 'printName'>