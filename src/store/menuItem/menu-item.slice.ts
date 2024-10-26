import { MenuItemResponse, TypeMenuItemFormState } from '@/types/menuItem.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialMenuState {
	items: MenuItemResponse[] | []
}

const initialState: InitialMenuState = {
	items: []

}


export const menuItemSlice = createSlice({
	name: 'menuSlice',
	initialState,
	reducers: {
		addAllMenuItems: (state, action: PayloadAction<MenuItemResponse[]>) => {
			state.items = [...action.payload]
		},
		deleteMenuItemById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		getMenuItemById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id == action.payload)
		},
		addMenuItem: (state, action: PayloadAction<MenuItemResponse>) => {
			state.items = [...state.items, action.payload]
		},
		updateMenuItem: (state, action: PayloadAction<{ id: number; data: Partial<TypeMenuItemFormState> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		},
		updateOrderMenuItem: (state, action: PayloadAction<number[]>) => {
			const idOrderMap = action.payload.reduce((acc, id, index) => {
				acc[id] = index
				return acc
			}, {} as { [id: string]: number })

			state.items = state.items.map(menuItem => ({
				...menuItem,
				dishOrder: idOrderMap[menuItem.id ? menuItem.id : 100]
			}))
		},



	}

})
export const { addAllMenuItems, deleteMenuItemById, addMenuItem, updateMenuItem, updateOrderMenuItem } = menuItemSlice.actions