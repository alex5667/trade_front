import { MealConsumptionResponse } from '@/types/mealConsumption.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialMealConsumptionState {
	items: MealConsumptionResponse[]
}

const initialState: InitialMealConsumptionState = {
	items: []

}


export const mealConsumptionSlice = createSlice({
	name: 'mealConsumptionSlice',
	initialState,
	reducers: {
		addAllMealConsumptions: (state, action: PayloadAction<MealConsumptionResponse[]>) => {
			state.items = action.payload
		},
		deleteMealConsumptionById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addMealConsumption: (state, action: PayloadAction<MealConsumptionResponse>) => {
			state.items.push(action.payload)
			console.log('state.items', state.items)
		},
		updateMealConsumption: (state, action: PayloadAction<{ id: number; data: Partial<MealConsumptionResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllMealConsumptions, deleteMealConsumptionById, addMealConsumption, updateMealConsumption } = mealConsumptionSlice.actions