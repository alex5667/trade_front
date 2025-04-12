import { URLS } from '@/config/urls'
import { addAllMealConsumptions, addMealConsumption, deleteMealConsumptionById, updateMealConsumption } from '@/store/meal-consumption/meal-consumption.slice'
import { TypeRootState } from '@/store/store'
import { MealConsumptionDataFilters, MealConsumptionResponse, MealFConsumptionFormState } from '@/types/meal-consumption.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type MealConsumptionUpdate = { id: number; data: MealFConsumptionFormState }


export const mealConsumptionApi = createApi({
	reducerPath: 'mealConsumption',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['mealConsumptions'],
	endpoints: builder => ({

		getAllMealConsumptions: builder.query<MealConsumptionResponse[], MealConsumptionDataFilters>({
			query: (queryData = {} as MealConsumptionDataFilters) => ({
				url: URLS.MEALCONSUMPTIONS,
				method: 'GET',
				params: queryData

			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllMealConsumptions(data.data))
				} catch (err) {
					console.error('Failed to fetch item...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'mealConsumptions' as const, id })),
						{ type: 'mealConsumptions', id: 'LIST' }
					]
					: [{ type: 'mealConsumptions', id: 'LIST' }]

		}),
		deleteMealConsumption: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.MEALCONSUMPTIONS}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousTasks = (getState() as TypeRootState).mealConsumptionSlice.items
				dispatch(deleteMealConsumptionById(+id))
				try {
					await queryFulfilled
				} catch {
					addAllMealConsumptions(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'mealConsumptions', id: arg }]
		}),


		createMealConsumption: builder.mutation<MealConsumptionResponse, MealFConsumptionFormState>({
			query: data => ({
				url: URLS.MEALCONSUMPTIONS,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(addMealConsumption(data))
				} catch {
					console.log("Error to create")
				}
			},
			// invalidatesTags: (result, error, arg) =>
			// 	result ? [{ type: 'mealConsumptions', id: result.id }, { type: 'mealConsumptions', id: 'LIST' }] : [{ type: 'mealConsumptions', id: 'LIST' }]
			invalidatesTags: (result, error, arg) => result ? [{ type: 'mealConsumptions', id: result.id }] : []
		}),
		updateMealConsumption: builder.mutation<MealConsumptionResponse, MealConsumptionUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.MEALCONSUMPTIONS}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				const previousTask = (getState() as TypeRootState).mealConsumptionSlice.items.find(item => item.id === id)
				dispatch(updateMealConsumption({ id, data }))
				try {
					const { data } = await queryFulfilled
					dispatch(updateMealConsumption({ id, data }))
				} catch (error) {
					if (previousTask) updateMealConsumption({ id, data })
					console.log("Error to update")

				}
			},
			// invalidatesTags: (result, error, arg) => result ? [{ type: 'mealConsumptions', id: result.id }] : []
		}),

		getByInstitutionSlug: builder.query<MealConsumptionResponse[], string>({
			query: (institutionSlug) => ({
				url: `${URLS.MEAL_CONSUMPTION_ITEM_BY_INSTITUTION}/${institutionSlug}`,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllMealConsumptions(data.data))
				} catch (err) {
					console.error('Failed to fetch items...', err)
				}
			}
		}),

	})
})
export const { useCreateMealConsumptionMutation, useGetAllMealConsumptionsQuery, useDeleteMealConsumptionMutation, useUpdateMealConsumptionMutation } = mealConsumptionApi