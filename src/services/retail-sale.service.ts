'use strict'

import { URLS } from '@/config/urls'
import { addAllRetailSales, addRetailSale, deleteRetailSaleById, updateRetailSale } from '@/store/retail-sale/retail-sale.slice'
import { TypeRootState } from '@/store/store'
import { MealFConsumptionFormState, RetailSaleDataFilters, RetailSaleResponse } from '@/types/retailSale.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type RetailSaleUpdate = { id: number; data: MealFConsumptionFormState }


export const retailSaleApi = createApi({
	reducerPath: 'retailSale',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['retailSales'],
	endpoints: builder => ({

		getAllRetailSales: builder.query<RetailSaleResponse[], RetailSaleDataFilters>({
			query: (queryData = {} as RetailSaleDataFilters) => ({
				url: URLS.RETAILSALES,
				method: 'GET',
				params: queryData

			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllRetailSales(data.data))
				} catch (err) {
					console.error('Failed to fetch item...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'retailSales' as const, id })),
						{ type: 'retailSales', id: 'LIST' }
					]
					: [{ type: 'retailSales', id: 'LIST' }]

		}),
		deleteRetailSale: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.RETAILSALES}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousTasks = (getState() as TypeRootState).retailSaleSlice.items
				dispatch(deleteRetailSaleById(+id))
				try {
					await queryFulfilled
				} catch {
					addAllRetailSales(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'retailSales', id: arg }]
		}),


		createRetailSale: builder.mutation<RetailSaleResponse, MealFConsumptionFormState>({
			query: data => ({
				url: URLS.RETAILSALES,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(addRetailSale(data))
				} catch {
					console.log("Error to create")
				}
			},
			// invalidatesTags: (result, error, arg) =>
			// 	result ? [{ type: 'retailSales', id: result.id }, { type: 'retailSales', id: 'LIST' }] : [{ type: 'retailSales', id: 'LIST' }]
			invalidatesTags: (result, error, arg) => result ? [{ type: 'retailSales', id: result.id }] : []
		}),
		updateRetailSale: builder.mutation<RetailSaleResponse, RetailSaleUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.RETAILSALES}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				const previousTask = (getState() as TypeRootState).retailSaleSlice.items.find(item => item.id === id)
				dispatch(updateRetailSale({ id, data }))
				try {
					const { data } = await queryFulfilled
					dispatch(updateRetailSale({ id, data }))
				} catch (error) {
					if (previousTask) updateRetailSale({ id, data })
					console.log("Error to update")

				}
			},
			// invalidatesTags: (result, error, arg) => result ? [{ type: 'retailSales', id: result.id }] : []
		}),

		getByInstitutionSlug: builder.query<RetailSaleResponse[], string>({
			query: (institutionSlug) => ({
				url: `${URLS.MEAL_CONSUMPTION_ITEM_BY_INSTITUTION}/${institutionSlug}`,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllRetailSales(data.data))
				} catch (err) {
					console.error('Failed to fetch items...', err)
				}
			}
		}),

	})
})
export const { useCreateRetailSaleMutation, useGetAllRetailSalesQuery, useDeleteRetailSaleMutation, useUpdateRetailSaleMutation } = retailSaleApi