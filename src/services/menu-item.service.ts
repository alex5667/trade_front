import { URLS } from '@/config/urls'
import { addAllMenuItems, addMenuItem, deleteMenuItemById, updateMenuItem, updateOrderMenuItem } from '@/store/menuItem/menu-item.slice'
import { TypeRootState } from '@/store/store'
import { MenuItemDataFilters, MenuItemExcelDto, MenuItemResponse, TypeMenuItemFormState } from '@/types/menuItem.type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWIthReAuth } from './baseQueries'

type MenuItemUpdate = { id: number; data: TypeMenuItemFormState }


export const menuItemApi = createApi({
	reducerPath: 'menu',
	baseQuery: baseQueryWIthReAuth,
	tagTypes: ['menuItems'],
	endpoints: builder => ({

		getAllMenuItem: builder.query<MenuItemResponse[], MenuItemDataFilters>({
			query: (queryData = {} as MenuItemDataFilters) => ({
				url: URLS.MENU_ITEM,
				method: 'GET',
				params: queryData
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllMenuItems(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			},
			providesTags: result =>
				result
					? [
						...result.map(({ id }) => ({ type: 'menuItems' as const, id })),
						{ type: 'menuItems', id: 'LIST' }
					]
					: [{ type: 'menuItems', id: 'LIST' }]

		}),
		deleteMenuItem: builder.mutation<void, number>({
			query: id => ({
				url: `${URLS.MENU_ITEM}/${id}`,
				method: 'DELETE'
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const previousTasks = (getState() as TypeRootState).menuSlice.items
				dispatch(deleteMenuItemById(+id))
				try {
					await queryFulfilled
				} catch {
					addAllMenuItems(previousTasks)
					console.log("Error to delete")
				}
			},

			invalidatesTags: (result, error, arg) => [{ type: 'menuItems', id: arg }]
		}),

		getByInstitutionSlug: builder.query<MenuItemResponse[], string>({
			query: (institutionSlug) => ({
				url: `${URLS.MENU_ITEM_BY_INSTITUTION}/${institutionSlug}`,
				method: 'GET',
			}),
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
				try {
					const data = await queryFulfilled
					dispatch(addAllMenuItems(data.data))
				} catch (err) {
					console.error('Failed to fetch menu...', err)
				}
			}
		}),
		createMenuItem: builder.mutation<MenuItemResponse, TypeMenuItemFormState>({
			query: data => ({
				url: URLS.MENU_ITEM,
				method: 'POST',
				body: data
			}),
			async onQueryStarted(data, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					dispatch(addMenuItem(data))
				} catch {
					console.log("Error to create")
				}
			},

			invalidatesTags: (result, error, arg) =>
				result ? [{ type: 'menuItems', id: result.id }, { type: 'menuItems', id: 'LIST' }] : [{ type: 'menuItems', id: 'LIST' }]
		}),
		downloadFromExcelMenuItem: builder.mutation<void, MenuItemExcelDto>({
			query: data => ({
				url: URLS.MENU_ITEM_EXCEL,
				method: 'POST',
				body: data
			}),
			// async onQueryStarted(data, { dispatch, queryFulfilled }) {
			// 	try {
			// 		const { data } = await queryFulfilled
			// 		dispatch(addMenuItem(data))
			// 	} catch {
			// 		console.log("Error to create")
			// 	}
			// },
			invalidatesTags: (result, error, arg) => [
				{ type: 'menuItems', id: 'LIST' }
			]
		}),
		updateMenuItem: builder.mutation<MenuItemResponse, MenuItemUpdate>({
			query: ({ id, data }) => ({
				url: `${URLS.MENU_ITEM}/${id}`,
				method: 'PUT',
				body: data
			}), async onQueryStarted({ id, data }, { dispatch, queryFulfilled, getState }) {
				const previousTask = (getState() as TypeRootState).menuSlice.items.find(item => item.id === id)
				dispatch(updateMenuItem({ id, data }))
				try {
					const { data } = await queryFulfilled
					dispatch(updateMenuItem({ id, data }))
				} catch (error) {
					if (previousTask) updateMenuItem({ id, data: previousTask })
					console.log("Error to update")

				}
			},
			invalidatesTags: (result, error, arg) => [{ type: 'menuItems', id: arg.id }]
		}),
		updateOrderMenuItem: builder.mutation<MenuItemResponse[], { id: number; dishOrder: number }[]>({
			query: items => ({
				url: `${URLS.MENU_ITEM_ORDER_UPDATE}`,
				method: 'PUT',
				body: { items }
			}),
			async onQueryStarted(items, { dispatch, queryFulfilled }) {
				dispatch(updateOrderMenuItem(items))
				try {
					await queryFulfilled
				} catch {
					console.log("Error updating order")
				}
			},
			invalidatesTags: (result, error, arg) => [
				{ type: 'menuItems', id: 'LIST' }
			]
		})

	})
})
export const { useGetAllMenuItemQuery, usePrefetch, useGetByInstitutionSlugQuery, useDeleteMenuItemMutation, useCreateMenuItemMutation, useUpdateMenuItemMutation, useUpdateOrderMenuItemMutation, useDownloadFromExcelMenuItemMutation } = menuItemApi