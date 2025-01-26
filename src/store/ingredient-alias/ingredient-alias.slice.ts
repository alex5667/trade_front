import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialIngredientAliasState {
	items: IngredientAliasResponse[]
}

const initialState: InitialIngredientAliasState = {
	items: []

}


export const ingredientAliasSlice = createSlice({
	name: 'ingredientAliasSlice',
	initialState,
	reducers: {
		addAllAliasIngredients: (state, action: PayloadAction<IngredientAliasResponse[]>) => {
			state.items = action.payload
		},
		deleteAliasIngredientById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addAliasIngredient: (state, action: PayloadAction<IngredientAliasResponse>) => {
			state.items.push(action.payload)
		},
		updateAliasIngredient: (state, action: PayloadAction<{ id: number; data: Partial<IngredientAliasResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllAliasIngredients, deleteAliasIngredientById, addAliasIngredient, updateAliasIngredient } = ingredientAliasSlice.actions