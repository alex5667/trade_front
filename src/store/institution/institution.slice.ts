import { InstitutionResponse } from '@/types/institution.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialInstitutionState {
	items: InstitutionResponse[]
}

const initialState: InitialInstitutionState = {
	items: []

}


export const institutionSlice = createSlice({
	name: 'institutionSlice',
	initialState,
	reducers: {
		addAllInstitutions: (state, action: PayloadAction<InstitutionResponse[]>) => {
			state.items = action.payload
		},
		deleteInstitutionById: (state, action: PayloadAction<number>) => {
			state.items = state.items.filter(item => item.id !== action.payload)
		},
		addInstitution: (state, action: PayloadAction<InstitutionResponse>) => {
			state.items.push(action.payload)
		},
		updateInstitution: (state, action: PayloadAction<{ id: number; data: Partial<InstitutionResponse> }>) => {
			const index = state.items.findIndex(item => item.id === action.payload.id)
			if (index !== -1) {
				state.items[index] = { ...state.items[index], ...action.payload.data }
			}

		}



	}

})
export const { addAllInstitutions, deleteInstitutionById, addInstitution, updateInstitution } = institutionSlice.actions