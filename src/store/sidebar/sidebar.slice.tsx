import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface InitialMenuState {
	isVisible: boolean
}

const initialState: InitialMenuState = {
	isVisible: false
}
export const sidebarSlice = createSlice({
	name: 'sidebarSlice',
	initialState,
	reducers: {
		setIsVisible: (state, action: PayloadAction<boolean>) => {
			state.isVisible = action.payload
		}
	}
})
