'use strict'

import { URLS } from '@/config/urls'
import { addAliasDish, addAllAliasDishs, deleteAliasDishById } from '@/store/dish-alias/dih-alias.slice'
import { TypeRootState } from '@/store/store'
import { DishAliasFormState, DishAliasResponse } from '@/types/dish-alias.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type DishAliasUpdate = { id: number; data: DishAliasFormState }
export const dishAliasApi = createApi({
	reducerPath: 'dishAliasApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['DishAlias'],
	endpoints: (builder) => ({
		getAllDishAliases: builder.query<DishAliasResponse[], void>({
			query: () => URLS.DISH_ALIAS,
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllAliasDishs(data.data))
				} catch (err) {
					console.error('Failed to fetch aliases...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'DishAlias' as const, id })),
						{ type: 'DishAlias', id: 'LIST' }
					]
					: [{ type: 'DishAlias', id: 'LIST' }],
		}),
		getDishAliasByName: builder.query<DishAliasResponse[], string>({
			query: (name) => ({
				url: URLS.DISH_ALIAS_BY_NAME_CONTAINS,
				method: 'GET',
				params: { name },
			}),
			providesTags: (result, error, name) => [{ type: 'DishAlias', id: 'LIST' }],
		}),
		getDishAliasesByDishName: builder.query<DishAliasResponse[], string | undefined>({
			query: (name) => `${URLS.DISH_ALIAS_BY_NAME}/${name}`,
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllAliasDishs(data.data))
				} catch (err) {
					console.error('Failed to fetch aliases...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'DishAlias' as const, id })),
						{ type: 'DishAlias', id: 'LIST' }
					]
					: [{ type: 'DishAlias', id: 'LIST' }],
		}),
		getDishAliasById: builder.query<DishAliasResponse, number>({
			query: (id) => `${URLS.DISH_ALIAS}/${id}`,
			providesTags: (result, error, id) => [{ type: 'DishAlias', id }],
		}),
		createDishAlias: builder.mutation<DishAliasResponse, DishAliasFormState>({
			query: (newAlias) => ({
				url: URLS.DISH_ALIAS,
				method: 'POST',
				body: newAlias,
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const data = await queryFulfilled
					dispatch(addAliasDish(data.data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: ['DishAlias'],
		}),
		updateDishAlias: builder.mutation<DishAliasResponse, DishAliasUpdate>({
			query: ({ id, ...updatedAlias }) => ({
				url: `${URLS.DISH_ALIAS}/${id}`,
				method: 'PUT',
				body: updatedAlias,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'DishAlias', id }],
		}),
		deleteDishAlias: builder.mutation({
			query: (id) => ({
				url: `${URLS.DISH_ALIAS}/${id}`,
				method: 'DELETE',
			}), async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousAlias = (getState() as TypeRootState).dishAliasSlice.items
				dispatch(deleteAliasDishById(+id))
				try {
					await queryFulfilled
				} catch {
					// 		addAllDishes(previousTasks)
					console.log("Error to delete")
				}
			},
			invalidatesTags: (result, error, id) => [{ type: 'DishAlias', id }],
		}),
	}),
})

export const {
	useGetAllDishAliasesQuery,
	useGetDishAliasesByDishNameQuery,
	useGetDishAliasByIdQuery,
	useCreateDishAliasMutation,
	useUpdateDishAliasMutation,
	useDeleteDishAliasMutation,
	useGetDishAliasByNameQuery
} = dishAliasApi
