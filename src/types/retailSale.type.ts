'use strict'

import { DishResponse } from './dish.type'



export interface RetailSaleResponse {
	id?: number,
	dish: DishResponse,
	quantity: number,
	price: number,
	totalAmount: number,
	saleDate: string,
	createdAt: string,
	updatedAt: string

}

export type RetailSaleFormState = Partial<RetailSaleResponse>

export type RetailSaleForm = Omit<RetailSaleResponse, 'id' | 'createdAt' | 'updatedAt'>

export enum EnumRetailSaleSort {
	HIGH_QUANTITY = 'high-quantity',
	LOW_QUANTITY = 'low-quantity',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export class RetailSaleDataFilters {

	sort?: EnumRetailSaleSort | string

	searchTem?: string

	startDate?: string

	endDate?: string


	dishName?: string

	minQuantity?: string


	maxQuantity?: string

}
