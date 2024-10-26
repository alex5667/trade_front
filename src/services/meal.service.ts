import { URLS } from '@/config/urls'
import { addAllMeals, addMeal, deleteMealById, updateMeal } from '@/store/meal/meal.slice'
import { updateMenuItem } from '@/store/menuItem/menu-item.slice'
import { TypeRootState } from '@/store/store'
import { MealFormState, MealResponse } from '@/types/meal.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type MealUpdate = { id: number; data: MealFormState }


export const mealApi = createApi({
	reducerPath: 'meal',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['meals'],
	endpoints: builder => ({

		getAllMeals: builder.query<MealResponse[], void>({
			query: () => ({
				url: URLS.MEALS,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllMeals(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'meals' as const, id })),
						{ type: 'meals', id: 'LIST' }
					]
					: [{ type: 'meals', id: 'LIST' }]

		}),
		deleteMeal: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.MEALS}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousTasks = (getState() as TypeRootState).mealSlice.items
				dispatch(deleteMealById(+id))
				try {
					await queryFulfilled
				} catch {
					addAllMeals(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'meals', id: arg }]
		}),

		getMealBySlug: builder.query<MealResponse, string>({
			query: (mealSlug) => ({
				url: `${URLS.MEAL_BY_SLUG}/${mealSlug}`,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					await queryFulfilled
					// const data = await queryFulfilled
					// dispatch(addAllMenuItems(data.data))
				} catch (err) {
					console.error('Failed to fetch meal...', err)
				}
			}
		}),
		createMeal: builder.mutation<MealResponse, MealFormState>({
			query: data => ({
				url: URLS.MEALS,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(addMeal(data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'meals', id: 'LIST' }]
		}),
		updateMeal: builder.mutation<MealResponse, MealUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.MEALS}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				const previousTask = (getState() as TypeRootState).mealSlice.items.find(item => item.id === id)
				dispatch(updateMenuItem({ id, data }))
				try {
					const { data } = await queryFulfilled
					dispatch(updateMeal({ id, data }))
				} catch (error) {
					if (previousTask) updateMeal({ id, data })
					console.log("Error to update")

				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'meals', id: arg.id }]
		})

	})
})
export const { useCreateMealMutation, useGetAllMealsQuery, useDeleteMealMutation, useUpdateMealMutation, useGetMealBySlugQuery } = mealApi