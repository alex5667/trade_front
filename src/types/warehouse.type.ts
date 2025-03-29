export interface WarehouseResponse {
	id: number
	name: string
	printName: string
	description?: string
	location?: string
	createdAt: string
	updatedAt: string
}

export interface CreateWarehouseDto {
	name: string
	printName?: string
	description?: string
	location?: string
}

export interface WarehouseFormState extends CreateWarehouseDto {
	id?: number
}

export type UpdateWarehouseDto = Partial<CreateWarehouseDto>
