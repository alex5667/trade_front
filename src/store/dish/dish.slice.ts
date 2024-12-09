import { DishResponse } from '@/types/dish.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialDishState {
	items: DishResponse[]
}

const initialState: InitialDishState = {
	items: []

}


export const dishSlice = createSlice({
	name: 'dishSlice',
	initialState,
	reducers: {
		addAllDishes: (state, action: PayloadAction<DishResponse[]>) => {
			state.items = action.payload
		},
		deleteDishById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addDish: (state, action: PayloadAction<DishResponse>) => {
			state.items.push(action.payload)
		},

		updateDish: (state, action: PayloadAction<{ id: number; data: Partial<DishResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})


export const { addAllDishes, deleteDishById, addDish, updateDish } = dishSlice.actions