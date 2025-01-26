import { URLS } from '@/config/urls'
import { addAliasIngredient, addAllAliasIngredients, deleteAliasIngredientById } from '@/store/ingredient-alias/ingredient-alias.slice'
import { TypeRootState } from '@/store/store'
import { IngredientAliasFormState, IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'
type IngredientAliasUpdate = { id: number; data: IngredientAliasFormState }
export const ingredientAliasApi = createApi({
	reducerPath: 'ingredientAliasApi',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['IngredientAlias'],
	endpoints: (builder) => ({
		getAllAliases: builder.query<IngredientAliasResponse[], void>({
			query: () => URLS.INGREDIENT_ALIAS,
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllAliasIngredients(data.data))
				} catch (err) {
					console.error('Failed to fetch aliases...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'IngredientAlias' as const, id })),
						{ type: 'IngredientAlias', id: 'LIST' }
					]
					: [{ type: 'IngredientAlias', id: 'LIST' }],
		}),
		getAliasesByIngredientName: builder.query<IngredientAliasResponse[], string | undefined>({
			query: (name) => `${URLS.INGREDIENT_ALIAS_BY_NAME}/${name}`,
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllAliasIngredients(data.data))
				} catch (err) {
					console.error('Failed to fetch aliases...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'IngredientAlias' as const, id })),
						{ type: 'IngredientAlias', id: 'LIST' }
					]
					: [{ type: 'IngredientAlias', id: 'LIST' }],
		})
		,
		getAliasById: builder.query<IngredientAliasResponse, number>({
			query: (id) => `${URLS.INGREDIENT_ALIAS}/${id}`,
			providesTags: (result, error, id) => [{ type: 'IngredientAlias', id }],
		}),
		createAlias: builder.mutation<IngredientAliasResponse, IngredientAliasFormState>({
			query: (newAlias) => ({
				url: URLS.INGREDIENT_ALIAS,
				method: 'POST',
				body: newAlias,
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const data = await queryFulfilled
					dispatch(addAliasIngredient(data.data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: ['IngredientAlias'],
		}),
		updateAlias: builder.mutation<IngredientAliasResponse, IngredientAliasUpdate>({
			query: ({ id, ...updatedAlias }) => ({
				url: `${URLS.INGREDIENT_ALIAS}/${id}`,
				method: 'PUT',
				body: updatedAlias,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'IngredientAlias', id }],
		}),
		deleteAlias: builder.mutation({
			query: (id) => ({
				url: `${URLS.INGREDIENT_ALIAS}/${id}`,
				method: 'DELETE',
			}), async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousAlias = (getState() as TypeRootState).ingredientAliasSlice.items
				dispatch(deleteAliasIngredientById(+id))
				try {
					await queryFulfilled
				} catch {
					// 		addAllDishes(previousTasks)
					console.log("Error to delete")
				}
			},
			invalidatesTags: (result, error, id) => [{ type: 'IngredientAlias', id }],
		}),
	}),
})

export const {
	useGetAllAliasesQuery,
	useGetAliasesByIngredientNameQuery,
	useGetAliasByIdQuery,
	useCreateAliasMutation,
	useUpdateAliasMutation,
	useDeleteAliasMutation,
} = ingredientAliasApi
