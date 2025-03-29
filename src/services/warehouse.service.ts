import { URLS } from '@/config/urls'
import { addAllWarehouses, addWarehouse } from '@/store/warehouse/warehouse.slice'
import { WarehouseFormState, WarehouseResponse } from '@/types/warehouse.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

export const warehouseApi = createApi({
	reducerPath: 'warehouse',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['warehouses'],
	endpoints: builder => ({
		getAllWarehouses: builder.query<WarehouseResponse[], void>({
			query: () => ({
				url: URLS.WAREHOUSES,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllWarehouses(data.data))
				} catch (err) {
					console.error('Failed to fetch warehouses...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'warehouses' as const, id })),
						{ type: 'warehouses', id: 'LIST' }
					]
					: [{ type: 'warehouses', id: 'LIST' }]
		}),

		getWarehouseById: builder.query<WarehouseResponse, string>({
			query: (id) => ({
				url: `${URLS.WAREHOUSES}/${id}`,
				method: 'GET',
			}),
			providesTags: (result, error, id) => [{ type: 'warehouses', id }],
		}),

		getWarehouseByName: builder.query<WarehouseResponse[], string>({
			query: (name) => ({
				url: URLS.WAREHOUSES,
				method: 'GET',
				params: { name },
			}),
			transformResponse: (response: WarehouseResponse[], meta, arg) => {
				if (!arg) return []
				return response.filter(warehouse =>
					warehouse.name.toLowerCase().includes(arg.toLowerCase())
				)
			},
			providesTags: [{ type: 'warehouses', id: 'LIST' }],
		}),

		createWarehouse: builder.mutation<WarehouseResponse, WarehouseFormState>({
			query: data => ({
				url: URLS.WAREHOUSES,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const result = await queryFulfilled
					dispatch(addWarehouse(result.data))
				} catch (error) {
					console.error('Error creating warehouse:', error)
				}
			},
			invalidatesTags: () => [{ type: 'warehouses', id: 'LIST' }]
		}),

		updateWarehouse: builder.mutation<WarehouseResponse, { id: number; data: WarehouseFormState }>({
			query: ({ id, data }) => ({
				url: `${URLS.WAREHOUSES}/${id}`,
				method: 'PATCH',
				body: data
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'warehouses', id: arg.id },
				{ type: 'warehouses', id: 'LIST' }
			]
		}),

		deleteWarehouse: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.WAREHOUSES}/${id}`,
				method: 'DELETE'
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'warehouses', id },
				{ type: 'warehouses', id: 'LIST' }
			]
		})
	})
})

export const {
	useGetAllWarehousesQuery,
	useGetWarehouseByIdQuery,
	useGetWarehouseByNameQuery,
	useCreateWarehouseMutation,
	useUpdateWarehouseMutation,
	useDeleteWarehouseMutation
} = warehouseApi 