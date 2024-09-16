import { MenuItemResponse } from '@/types/menuItem.type'
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
		getAllItems: (state, action: PayloadAction<MenuItemResponse[]>) => {
			state.items = action.payload
		}


	}

})
export const { getAllItems } = menuItemSlice.actions