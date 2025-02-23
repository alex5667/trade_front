import { MenuItemResponse } from './menuItem.type'

export interface InstitutionResponse {
	id: number,
	name: string
	printName: string
	description?: string
	createdAt: string
	updatedAt: string
	MenuItem?: MenuItemResponse[]
	slug: string
}

export type InstitutionFormState = Partial<InstitutionResponse>

export type InstitutionForm = Omit<InstitutionResponse, 'id' | 'createdAt' | 'updatedAt'>