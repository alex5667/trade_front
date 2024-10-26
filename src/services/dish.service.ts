import { URLS } from '@/config/urls'
import { DishFormState, DishResponse } from '@/types/dish.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type DishUpdate = { id: number; data: DishFormState }


export const dishApi = createApi({
	reducerPath: 'dish',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['dishes'],
	endpoints: builder => ({

		getAllDishes: builder.query<DishResponse[], void>({
			query: () => ({
				url: URLS.DISHES,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					await queryFulfilled
					// dispatch(addAllDishes(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'dishes' as const, id })),
						{ type: 'dishes', id: 'LIST' }
					]
					: [{ type: 'dishes', id: 'LIST' }]

		}),
		deleteDish: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.DISHES}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				// const previousTasks = (getState() as TypeRootState).disheslice.items
				// dispatch(deleteDishById(+id))
				try {
					await queryFulfilled
				} catch {
					// 		addAllDishes(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'dishes', id: arg }]
		}),


		createDish: builder.mutation<DishResponse, DishFormState>({
			query: data => ({
				url: URLS.DISHES,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					// 	dispatch(addDish(data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'dishes', id: 'LIST' }]
		}),
		getDishByName: builder.query<DishResponse[], string>({
			query: (name) => ({
				url: URLS.DISHES_BY_NAME,
				method: 'GET',
				params: { name },
			}),
			providesTags: (result, error, name) => [{ type: 'dishes', id: 'LIST' }],
		}),
		updateDish: builder.mutation<DishResponse, DishUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.DISHES}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				// const previousTask = (getState() as TypeRootState).dishSlice.items.find(item => item.id === id)
				// dispatch(updateMenuItem({ id, data }))
				try {
					await queryFulfilled
					// dispatch(updateDish({ id, data }))
				} catch (error) {
					// if (previousTask) updateDish({ id, data })
					console.log("Error to update")

				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'dishes', id: arg.id }]
		})

	})
})
export const { useCreateDishMutation, useGetAllDishesQuery, useDeleteDishMutation, useUpdateDishMutation, useGetDishByNameQuery } = dishApi