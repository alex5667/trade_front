import { URLS } from '@/config/urls'
import { addAllStockTransfers, addStockTransfer, deleteStockTransferById, updateStockTransfer } from '@/store/stock-transfer/stock-transfer.slice'
import { TypeRootState } from '@/store/store'
import { StockTransferDataFilters, StockTransferFormState, StockTransferResponse } from '@/types/stockTransfer.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type StockTransferUpdate = { id: number; data: StockTransferFormState }

// Класс для фильтров по диапазону дат
export class StockTransferByRangeDataFilters {
	startDate?: string
	endDate?: string
}

export const stockTransferApi = createApi({
	reducerPath: 'stockTransfer',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['stockTransfers'],
	endpoints: builder => ({
		getAllStockTransfers: builder.query<StockTransferResponse[], StockTransferDataFilters>({
			query: (queryData = {} as StockTransferDataFilters) => ({
				url: URLS.STOCK_TRANSFERS,
				method: 'GET',
				params: queryData
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllStockTransfers(data.data))
				} catch (err) {
					console.error('Failed to fetch stock transfers...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'stockTransfers' as const, id })),
						{ type: 'stockTransfers', id: 'LIST' }
					]
					: [{ type: 'stockTransfers', id: 'LIST' }]
		}),

		getAllStockTransfersByRange: builder.query<void, StockTransferByRangeDataFilters>({
			query: (queryData = {} as StockTransferByRangeDataFilters) => ({
				url: URLS.STOCK_TRANSFERS_BY_RANGE,
				method: 'GET',
				params: queryData
			})
		}),

		deleteStockTransfer: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.STOCK_TRANSFERS}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousTransfers = (getState() as TypeRootState).stockTransferSlice.items
				dispatch(deleteStockTransferById(+id))
				try {
					await queryFulfilled
				} catch {
					addAllStockTransfers(previousTransfers)
					console.log("Error deleting stock transfer")
				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'stockTransfers', id: arg }]
		}),

		createStockTransfer: builder.mutation<StockTransferResponse, StockTransferFormState>({
			query: data => ({
				url: URLS.STOCK_TRANSFERS,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(addStockTransfer(data))
				} catch {
					console.log("Error creating stock transfer")
				}
			},
			invalidatesTags: (result, error, arg) => result ? [{ type: 'stockTransfers', id: result.id }] : []
		}),

		updateStockTransfer: builder.mutation<StockTransferResponse, StockTransferUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.STOCK_TRANSFERS}/${id}`,
				method: 'PUT',
				body: data
			}),
			async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				const previousTransfer = (getState() as TypeRootState).stockTransferSlice.items.find(item => item.id === id)

				dispatch(updateStockTransfer({ id, data }))

				try {
					const { data } = await queryFulfilled
					dispatch(updateStockTransfer({ id, data }))
				} catch (error) {
					if (previousTransfer) {
						dispatch(updateStockTransfer({ id, data: previousTransfer }))
					}
					console.log("Error updating stock transfer")
				}
			}
		}),

		getByDishName: builder.query<StockTransferResponse[], string>({
			query: (dishName) => ({
				url: `${URLS.STOCK_TRANSFERS}`,
				method: 'GET',
				params: { dishName }
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllStockTransfers(data.data))
				} catch (err) {
					console.error('Failed to fetch items...', err)
				}
			}
		})
	})
})

export const {
	useGetAllStockTransfersQuery,
	useGetAllStockTransfersByRangeQuery,
	useDeleteStockTransferMutation,
	useCreateStockTransferMutation,
	useUpdateStockTransferMutation,
	useGetByDishNameQuery
} = stockTransferApi 