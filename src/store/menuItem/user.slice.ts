import { MenuItemResponse } from '@/types/menuItem.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialMenuState {
	items: MenuItemResponse[]
}

const initialState: InitialMenuState = {
	items: []

}


export const menuItemSlice = createSlice({
	name: 'menu',
	initialState,
	reducers: {
		addItems: (state, action: PayloadAction<MenuItemResponse[]>) => {
			state.items = [...state.items, ...action.payload]
		}


	}

})
export const { addItems } = menuItemSlice.actions