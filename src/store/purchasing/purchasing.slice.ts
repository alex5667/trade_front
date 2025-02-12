import { PurchasingResponse } from '@/types/purchasing.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialMenuState {
	item: PurchasingResponse
}

const initialState: InitialMenuState = {
	item: {} as PurchasingResponse

}


export const purchasingSlice = createSlice({
	name: 'menuSlice',
	initialState,
	reducers: {
		addAllPurchasings: (state, action: PayloadAction<PurchasingResponse>) => {

			state.item = action.payload
		},
		// deletePurchasingById: (state, action: PayloadAction<number>) => {
		// 	state.items = state.items.filter(item => item.id !== action.payload)
		// },
		// getPurchasingById: (state, action: PayloadAction<number>) => {
		// 	state.items = state.items.filter(item => item.id == action.payload)
		// },
		// addPurchasing: (state, action: PayloadAction<PurchasingResponse>) => {
		// 	state.items = [...state.items, action.payload]
		// },
		// updatePurchasing: (state, action: PayloadAction<{ id: number; data: Partial<TypePurchasingFormState> }>) => {
		// 	const index = state.items.findIndex(item => item.id === action.payload.id)
		// 	if (index !== -1) {
		// 		state.items[index] = { ...state.items[index], ...action.payload.data }
		// 	}

		// },
		// updateOrderPurchasing: (state, action: PayloadAction<{ id: number; dishOrder: number }[]>) => {
		// 	const idOrderMap = action.payload.reduce((acc, item) => {
		// 		acc[item.id] = item.dishOrder
		// 		return acc
		// 	}, {} as { [id: number]: number })

		// 	state.items = state.items.map(purchasing => {
		// 		if (purchasing.id !== undefined && purchasing.id in idOrderMap) {
		// 			return {
		// 				...purchasing,
		// 				dishOrder: idOrderMap[purchasing.id]
		// 			}
		// 		}
		// 		return purchasing
		// 	})
		// }
	}

},





)
export const { addAllPurchasings } = purchasingSlice.actions