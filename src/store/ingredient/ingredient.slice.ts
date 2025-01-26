import { IngredientResponse } from '@/types/ingredient.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialIngredientState {
	items: IngredientResponse[]
}

const initialState: InitialIngredientState = {
	items: []

}


export const ingredientSlice = createSlice({
	name: 'ingredientSlice',
	initialState,
	reducers: {
		addAllIngredients: (state, action: PayloadAction<IngredientResponse[]>) => {
			state.items = action.payload
		},
		deleteIngredientById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addIngredient: (state, action: PayloadAction<IngredientResponse>) => {
			state.items.push(action.payload)
		},
		updateIngredient: (state, action: PayloadAction<{ id: number; data: Partial<IngredientResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllIngredients, deleteIngredientById, addIngredient, updateIngredient } = ingredientSlice.actions