
export interface MealResponse {
	id: number,
	name: string,
	printName: string,
	description?: string,
	createdAt?: string,
	updatedAt?: string
	slug: string


}
export type MealResponsePartial = Partial<MealResponse>
export type MealFormState = Pick<MealResponse, 'name' | 'printName'> & Partial<Omit<MealResponse, 'name' | 'printName'>>

export type MealForm = Omit<MealResponse, 'id' | 'createdAt' | 'updatedAt'>