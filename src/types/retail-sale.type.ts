'use strict'

import { DishResponse } from './dish.type'

export interface RetailSaleResponse {
	id?: number,
	createdAt?: string,
	updatedAt?: string | undefined,
	price: number,
	totalAmount: number,
	saleDate: string,
	quantity: number,
	dish: DishResponse

}

export type RetailSaleFormState = {
	date: string,
	institutionId: number | undefined,
	mealId: number | undefined,
	quantity: number,
}

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


	dish?: DishResponse


	minQuantity?: string


	maxQuantity?: string

}
