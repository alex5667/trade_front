import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialTaskState {
	items: string[]
}

const initialState: InitialTaskState = {
	items: []

}


export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {

		addItem: (state, action: PayloadAction<string>) => {
			state.items.push(action.payload)
		}


	}

})