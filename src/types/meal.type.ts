
export interface MealResponse {
	id: number,
	name: string,
	printName: string,
	description?: string,
	createdAt?: string,
	updatedAt?: string
	slug: string


}

export type MealFormState = Partial<MealResponse>

export type MealForm = Omit<MealResponse, 'id' | 'createdAt' | 'updatedAt'>