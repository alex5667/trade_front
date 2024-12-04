import { URLS } from '@/config/urls'
import { addAllInstitutions } from '@/store/institution/institution.slice'
import { InstitutionFormState, InstitutionResponse } from '@/types/institution.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type InstitutionUpdate = { id: number; data: InstitutionFormState }


export const institutionApi = createApi({
	reducerPath: 'institution',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['institutions'],
	endpoints: builder => ({

		getAllInstitutions: builder.query<InstitutionResponse[], void>({
			query: () => ({
				url: URLS.INSTITUTIONS,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllInstitutions(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'institutions' as const, id })),
						{ type: 'institutions', id: 'LIST' }
					]
					: [{ type: 'institutions', id: 'LIST' }]

		}),
		deleteInstitution: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.INSTITUTIONS}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				// const previousTasks = (getState() as TypeRootState).institutionslice.items
				// dispatch(deleteInstitutionById(+id))
				try {
					await queryFulfilled
				} catch {
					// 		addAllInstitutions(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'institutions', id: arg }]
		}),


		createInstitution: builder.mutation<InstitutionResponse, InstitutionFormState>({
			query: data => ({
				url: URLS.INSTITUTIONS,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					// 	dispatch(addInstitution(data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'institutions', id: 'LIST' }]
		}),
		getInstitutionByName: builder.query<InstitutionResponse[], string>({
			query: (name) => ({
				url: `${URLS.INSTITUTION_BY_NAME}/${name}`,
				method: 'GET',
			}),
			providesTags: (result, error, name) => [{ type: 'institutions', id: 'LIST' }],
		}),
		getInstitutionBySlug: builder.query<InstitutionResponse, string>({
			query: (slug) => ({
				url: `${URLS.INSTITUTION_BY_SLUG}/${slug}`,
				method: 'GET',
			}),
			providesTags: (result, error, name) => [{ type: 'institutions', id: 'LIST' }],
		}),
		updateInstitution: builder.mutation<InstitutionResponse, InstitutionUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.INSTITUTIONS}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				// const previousTask = (getState() as TypeRootState).institutionSlice.items.find(item => item.id === id)
				// dispatch(updateMenuItem({ id, data }))
				try {
					await queryFulfilled
					// dispatch(updateInstitution({ id, data }))
				} catch (error) {
					// if (previousTask) updateInstitution({ id, data })
					console.log("Error to update")

				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'institutions', id: arg.id }]
		})

	})
})
export const { useCreateInstitutionMutation, useGetAllInstitutionsQuery, useDeleteInstitutionMutation, useUpdateInstitutionMutation, useGetInstitutionByNameQuery, useGetInstitutionBySlugQuery } = institutionApi