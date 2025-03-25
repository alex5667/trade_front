import { DishAliasResponse } from '@/types/dish-alias.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialDishAliasState {
	items: DishAliasResponse[]
}

const initialState: InitialDishAliasState = {
	items: []

}


export const dishAliasSlice = createSlice({
	name: 'dishAliasSlice',
	initialState,
	reducers: {
		addAllAliasDishs: (state, action: PayloadAction<DishAliasResponse[]>) => {
			state.items = action.payload
		},
		deleteAliasDishById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addAliasDish: (state, action: PayloadAction<DishAliasResponse>) => {
			state.items.push(action.payload)
		},
		updateAliasDish: (state, action: PayloadAction<{ id: number; data: Partial<DishAliasResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllAliasDishs, deleteAliasDishById, addAliasDish, updateAliasDish } = dishAliasSlice.actions