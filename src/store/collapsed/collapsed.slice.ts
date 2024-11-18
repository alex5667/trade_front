import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface isCollapsed {
	isCollapsed: boolean
}
const initialState: isCollapsed = {
	isCollapsed: true
}


export const collapsedSlice = createSlice({
	name: 'collapsed',
	initialState,
	reducers: {
		setIsCollapsed: (state, action: PayloadAction<boolean>) => {
			state.isCollapsed = action.payload
		}
	}
})
