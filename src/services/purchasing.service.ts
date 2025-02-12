import { URLS } from '@/config/urls'

import { PurchasingResponse, PurshaingDataFilters } from '@/types/purchasing.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'



export const purchasingApi = createApi({
	reducerPath: 'purchasing',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['purchasings'],
	endpoints: builder => ({

		getAllPurchasing: builder.query<PurchasingResponse, PurshaingDataFilters>({
			query: (queryData = {} as PurshaingDataFilters) => ({
				url: URLS.PURCHASING,
				method: 'GET',
				params: queryData
			}),
			// onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
			// 	try {
			// 		const data = await queryFulfilled
			// 		dispatch(addAllPurchasings(data.data))
			// 	} catch (err) {
			// 		console.error('Failed to fetch purchasing...', err)
			// 	}
			// },
			providesTags: (result, error, name) => [{ type: 'purchasings', id: 'LIST' }],

		}),
		// deletePurchasing: builder.mutation<void, number>({
		// 	query: id => ({
		// 		url: `${URLS.MENU_ITEM}/${id}`,
		// 		method: 'DELETE'
		// 	}),
		// 	async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
		// 		const previousTasks = (getState() as TypeRootState).menuSlice.items
		// 		dispatch(deletePurchasingById(+id))
		// 		try {
		// 			await queryFulfilled
		// 		} catch {
		// 			addAllPurchasings(previousTasks)
		// 			console.log("Error to delete")
		// 		}
		// 	},

		// 	invalidatesTags: (result, error, arg) => [{ type: 'purchasings', id: arg }]
		// }),

		// getByInstitutionSlug: builder.query<PurchasingResponse[], string>({
		// 	query: (institutionSlug) => ({
		// 		url: `${URLS.MENU_ITEM_BY_INSTITUTION}/${institutionSlug}`,
		// 		method: 'GET',
		// 	}),
		// 	onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
		// 		try {
		// 			const data = await queryFulfilled
		// 			dispatch(addAllPurchasings(data.data))
		// 		} catch (err) {
		// 			console.error('Failed to fetch menu...', err)
		// 		}
		// 	}
		// }),
		// createPurchasing: builder.mutation<PurchasingResponse, TypePurchasingFormState>({
		// 	query: data => ({
		// 		url: URLS.MENU_ITEM,
		// 		method: 'POST',
		// 		body: data
		// 	}),
		// 	async onQueryStarted(data, { dispatch, queryFulfilled }) {
		// 		try {
		// 			const { data } = await queryFulfilled
		// 			dispatch(addPurchasing(data))
		// 		} catch {
		// 			console.log("Error to create")
		// 		}
		// 	},

		// 	invalidatesTags: (result, error, arg) =>
		// 		result ? [{ type: 'purchasings', id: result.id }, { type: 'purchasings', id: 'LIST' }] : [{ type: 'purchasings', id: 'LIST' }]
		// }),
		// downloadFromExcelPurchasing: builder.mutation<void, PurchasingExcelDto>({
		// 	query: data => ({
		// 		url: URLS.MENU_ITEM_EXCEL,
		// 		method: 'POST',
		// 		body: data
		// 	}),
		// 	// async onQueryStarted(data, { dispatch, queryFulfilled }) {
		// 	// 	try {
		// 	// 		const { data } = await queryFulfilled
		// 	// 		dispatch(addPurchasing(data))
		// 	// 	} catch {
		// 	// 		console.log("Error to create")
		// 	// 	}
		// 	// },
		// 	invalidatesTags: (result, error, arg) => [
		// 		{ type: 'purchasings', id: 'LIST' }
		// 	]
		// }),
		// updatePurchasing: builder.mutation<PurchasingResponse, PurchasingUpdate>({
		// 	query: ({ id, data }) => ({
		// 		url: `${URLS.MENU_ITEM}/${id}`,
		// 		method: 'PUT',
		// 		body: data
		// 	}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
		// 		const previousTask = (getState() as TypeRootState).menuSlice.items.find(item => item.id === id)
		// 		dispatch(updatePurchasing({ id, data }))
		// 		try {
		// 			const { data } = await queryFulfilled
		// 			dispatch(updatePurchasing({ id, data }))
		// 		} catch (error) {
		// 			if (previousTask) updatePurchasing({ id, data: previousTask })
		// 			console.log("Error to update")

		// 		}
		// 	},
		// 	invalidatesTags: (result, error, arg) => [{ type: 'purchasings', id: arg.id }]
		// }),
		// updateOrderPurchasing: builder.mutation<PurchasingResponse[], { id: number; dishOrder: number }[]>({
		// 	query: items => ({
		// 		url: `${URLS.MENU_ITEM_ORDER_UPDATE}`,
		// 		method: 'PUT',
		// 		body: { items }
		// 	}),
		// 	async onQueryStarted(items, { dispatch, queryFulfilled }) {
		// 		dispatch(updateOrderPurchasing(items))
		// 		try {
		// 			await queryFulfilled
		// 		} catch {
		// 			console.log("Error updating order")
		// 		}
		// 	},
		// 	invalidatesTags: (result, error, arg) => [
		// 		{ type: 'purchasings', id: 'LIST' }
		// 	]
		// })

	})
})
export const { useGetAllPurchasingQuery } = purchasingApi