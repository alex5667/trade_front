import { DishResponse } from './dish.type'
import { WarehouseResponse } from './warehouse.type'

export interface StockTransferResponse {
	id?: number
	fromWarehouseId: number
	toWarehouseId: number
	dishId: number
	quantity: number
	registrar?: string
	date: string
	createdAt?: string
	updatedAt?: string
	fromWarehouse?: WarehouseResponse
	toWarehouse?: WarehouseResponse
	dish?: DishResponse
}

export type StockTransferFormState = {
	fromWarehouseId: number | undefined
	toWarehouseId: number | undefined
	dishId: number | undefined
	quantity: number
	date: string
}

export type StockTransferForm = Omit<StockTransferResponse, 'id' | 'createdAt' | 'updatedAt'>

export enum EnumStockTransferSort {
	HIGH_QUANTITY = 'high-quantity',
	LOW_QUANTITY = 'low-quantity',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class StockTransferDataFilters {
	sort?: EnumStockTransferSort | string

	searchTem?: string

	startDate?: string

	endDate?: string

	dishName?: string

	minQuantity?: string

	maxQuantity?: string
} 