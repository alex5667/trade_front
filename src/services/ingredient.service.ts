import { URLS } from '../config/urls'

import { addAllIngredients } from '@/store/ingredient/ingredient.slice'
import { IngredientFormState, IngredientResponse } from '@/types/ingredient.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type IngredientUpdate = { id: number; data: IngredientFormState }


export const ingredientApi = createApi({
	reducerPath: 'ingredient',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['ingredients'],
	endpoints: builder => ({

		getAllIngredients: builder.query<IngredientResponse[], void>({
			query: () => ({
				url: URLS.INGREDIENTS,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllIngredients(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'ingredients' as const, id })),
						{ type: 'ingredients', id: 'LIST' }
					]
					: [{ type: 'ingredients', id: 'LIST' }]

		}),
		deleteIngredient: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.INGREDIENTS}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				// const previousTasks = (getState() as TypeRootState).ingredientslice.items
				// dispatch(deleteIngredientById(+id))
				try {
					await queryFulfilled
				} catch {
					// 		addAllIngredients(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'ingredients', id: arg }]
		}),


		createIngredient: builder.mutation<IngredientResponse, IngredientFormState>({
			query: data => ({
				url: URLS.INGREDIENTS,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					// 	dispatch(addIngredient(data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'ingredients', id: 'LIST' }]
		}),
		getIngredientByName: builder.query<IngredientResponse[], string>({
			query: (name) => ({
				url: URLS.INGREDIENTS_BY_NAME_CONTAINS,
				method: 'GET',
				params: { name },
			}),
			providesTags: (result, error, name) => [{ type: 'ingredients', id: 'LIST' }],
		}),
		getIngredientBySlug: builder.query<IngredientResponse, string>({
			query: (slug) => ({
				url: `${URLS.INGREDIENTS_BY_SLUG}/${slug}`,
				method: 'GET',
			}),
			providesTags: (result, error, name) => [{ type: 'ingredients', id: 'LIST' }],
		}),
		updateIngredient: builder.mutation<IngredientResponse, IngredientUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.INGREDIENTS}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				// const previousTask = (getState() as TypeRootState).ingredientSlice.items.find(item => item.id === id)
				// dispatch(updateMenuItem({ id, data }))
				try {
					await queryFulfilled
					// dispatch(updateIngredient({ id, data }))
				} catch (error) {
					// if (previousTask) updateIngredient({ id, data })
					console.log("Error to update")

				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'ingredients', id: arg.id }]
		})

	})
})
export const { useCreateIngredientMutation, useGetAllIngredientsQuery, useDeleteIngredientMutation, useUpdateIngredientMutation, useGetIngredientByNameQuery, useGetIngredientBySlugQuery } = ingredientApi