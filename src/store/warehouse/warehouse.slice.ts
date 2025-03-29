import { WarehouseResponse } from '@/types/warehouse.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
	items: WarehouseResponse[]
	isLoading: boolean
}

const initialState: InitialState = {
	items: [],
	isLoading: false
}

export const warehouseSlice = createSlice({
	name: 'warehouseSlice',
	initialState,
	reducers: {
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload
		},
		addAllWarehouses: (state, action: PayloadAction<WarehouseResponse[]>) => {
			state.items = action.payload
		},
		addWarehouse: (state, action: PayloadAction<WarehouseResponse>) => {
			state.items.push(action.payload)
		},
		updateWarehouse: (
			state,
			action: PayloadAction<{ id: number; data: Partial<WarehouseResponse> }>
		) => {
			const { id, data } = action.payload
			const index = state.items.findIndex(item => item.id === id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...data }
			}
		},
		deleteWarehouseById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		}
	}
})

export const {
	setIsLoading,
	addAllWarehouses,
	addWarehouse,
	updateWarehouse,
	deleteWarehouseById
} = warehouseSlice.actions

export const warehouseReducer = warehouseSlice.reducer 