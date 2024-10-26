import { MenuItemResponse } from './menuItem.type'

export interface InstitutionResponse {
	id: number,
	name: string
	printName: string
	description: string
	createdAt: string
	updatedAt: string
	MenuItem: MenuItemResponse[]
	slug: string
}

export type InstitutionFormState = Partial<Omit<InstitutionResponse, 'id' | 'createdAt' | 'updatedAt'>>

export type InstitutionForm = Omit<InstitutionResponse, 'id' | 'createdAt' | 'updatedAt'>