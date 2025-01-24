import { URLS } from '@/config/urls'
import { addAllDishCategory } from '@/store/dish-category/dishCategory.slice'
import { DishCategoryFormState, DishCategoryResponse } from '@/types/dishCategory.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type DishCategoryUpdate = { id: number; data: DishCategoryFormState }


export const dishCategoryApi = createApi({
	reducerPath: 'dishCategory',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['dishCategory'],
	endpoints: builder => ({

		getAllDishCategory: builder.query<DishCategoryResponse[], void>({
			query: () => ({
				url: URLS.DISHCATEGORIES,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllDishCategory(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'dishCategory' as const, id })),
						{ type: 'dishCategory', id: 'LIST' }
					]
					: [{ type: 'dishCategory', id: 'LIST' }]

		}),
		deleteDishCategory: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.DISHCATEGORIES}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				// const previousTasks = (getState() as TypeRootState).dishCategoryslice.items
				// dispatch(deleteDishCategoryById(+id))
				try {
					await queryFulfilled
				} catch {
					// 		addAllDishCategorys(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'dishCategory', id: arg }]
		}),


		createDishCategory: builder.mutation<DishCategoryResponse, DishCategoryFormState>({
			query: data => ({
				url: URLS.DISHCATEGORIES,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					// 	dispatch(addDishCategory(data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'dishCategory', id: 'LIST' }]
		}),
		getDishCategoryByName: builder.query<DishCategoryResponse[], string>({
			query: (name) => ({
				url: URLS.DISHCATEGORIES_BY_NAME_CONTAINS,
				method: 'GET',
				params: { name },
			}),
			providesTags: (result, error, name) => [{ type: 'dishCategory', id: 'LIST' }],
		}),
		getDishCategoryBySlug: builder.query<DishCategoryResponse, string>({
			query: (slug) => ({
				url: `${URLS.DISHCATEGORIES_BY_SLUG}/${slug}`,
				method: 'GET',
			}),
			providesTags: (result, error, name) => [{ type: 'dishCategory', id: 'LIST' }],
		}),
		updateDishCategory: builder.mutation<DishCategoryResponse, DishCategoryUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.DISHCATEGORIES}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				// const previousTask = (getState() as TypeRootState).dishCategorySlice.items.find(item => item.id === id)
				// dispatch(updateMenuItem({ id, data }))
				try {
					await queryFulfilled
					// dispatch(updateDishCategory({ id, data }))
				} catch (error) {
					// if (previousTask) updateDishCategory({ id, data })
					console.log("Error to update")

				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'dishCategory', id: arg.id }]
		})

	})
})
export const { useCreateDishCategoryMutation, useGetAllDishCategoryQuery, useDeleteDishCategoryMutation, useUpdateDishCategoryMutation, useGetDishCategoryByNameQuery, useGetDishCategoryBySlugQuery } = dishCategoryApi