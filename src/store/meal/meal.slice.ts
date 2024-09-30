import { MealResponse } from '@/types/meal.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialMealState {
	items: MealResponse[]
}

const initialState: InitialMealState = {
	items: []

}


export const mealSlice = createSlice({
	name: 'mealSlice',
	initialState,
	reducers: {
		addAllMeals: (state, action: PayloadAction<MealResponse[]>) => {
			state.items = action.payload
		},
		deleteMealById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addMeal: (state, action: PayloadAction<MealResponse>) => {
			state.items.push(action.payload)
		},
		updateMeal: (state, action: PayloadAction<{ id: number; data: Partial<MealResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllMeals, deleteMealById, addMeal, updateMeal } = mealSlice.actions