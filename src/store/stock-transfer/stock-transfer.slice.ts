import { StockTransferResponse } from '@/types/stockTransfer.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialStockTransferState {
	items: StockTransferResponse[]
}

const initialState: InitialStockTransferState = {
	items: []
}

export const stockTransferSlice = createSlice({
	name: 'stockTransferSlice',
	initialState,
	reducers: {
		addAllStockTransfers: (state, action: PayloadAction<StockTransferResponse[]>) => {
			state.items = action.payload
		},
		deleteStockTransferById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addStockTransfer: (state, action: PayloadAction<StockTransferResponse>) => {
			state.items = [...state.items, action.payload]
		},
		updateStockTransfer: (state, action: PayloadAction<{ id: number; data: Partial<StockTransferResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}
		}
	}
})

export const {
	addAllStockTransfers,
	deleteStockTransferById,
	addStockTransfer,
	updateStockTransfer
} = stockTransferSlice.actions 