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
export type InstitutionResponsePartial = Partial<InstitutionResponse>
export type InstitutionFormState = Pick<InstitutionResponse, 'name' | 'printName'> & Partial<Omit<InstitutionResponse, 'name' | 'printName'>>

export type InstitutionForm = Omit<InstitutionResponse, 'id' | 'createdAt' | 'updatedAt'>