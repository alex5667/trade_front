import { User } from '@/types/auth.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
	user: User | null
}

const initialState: InitialState = {
	user: null,
}


export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {

		addUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload
		},




	}

})

export const { addRoles, addUser } = userSlice.actions