import { RetailSaleResponse } from '@/types/retail-sale.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialRetailSaleState {
	items: RetailSaleResponse[]
}

const initialState: InitialRetailSaleState = {
	items: []

}


export const retailSaleSlice = createSlice({
	name: 'retailSaleSlice',
	initialState,
	reducers: {
		addAllRetailSales: (state, action: PayloadAction<RetailSaleResponse[]>) => {
			state.items = action.payload
		},
		deleteRetailSaleById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addRetailSale: (state, action: PayloadAction<RetailSaleResponse>) => {
			state.items = [...state.items, action.payload]
			console.log('state.items', state.items)
		},
		updateRetailSale: (state, action: PayloadAction<{ id: number; data: Partial<RetailSaleResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllRetailSales, deleteRetailSaleById, addRetailSale, updateRetailSale } = retailSaleSlice.actions