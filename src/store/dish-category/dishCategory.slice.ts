import { DishCategoryResponse } from '@/types/dishCategory.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialDishCategoryState {
	items: DishCategoryResponse[]
}

const initialState: InitialDishCategoryState = {
	items: []

}


export const dishCategorySlice = createSlice({
	name: 'dishCategorySlice',
	initialState,
	reducers: {
		addAllDishCategory: (state, action: PayloadAction<DishCategoryResponse[]>) => {
			state.items = action.payload
		},
		deleteDishCategoryById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addDishCategory: (state, action: PayloadAction<DishCategoryResponse>) => {
			state.items.push(action.payload)
		},
		updateDishCategory: (state, action: PayloadAction<{ id: number; data: Partial<DishCategoryResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllDishCategory, deleteDishCategoryById, addDishCategory, updateDishCategory } = dishCategorySlice.actions