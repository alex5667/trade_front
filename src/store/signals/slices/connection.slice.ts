/**
 * Connection Status Slice
 * ------------------------------
 * Redux slice for WebSocket connection status
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectionStatus } from '../signal.types'

interface ConnectionState {
	status: ConnectionStatus
	error: string | null
}

const initialState: ConnectionState = {
	status: 'disconnected',
	error: null
}

export const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		connecting: (state) => {
			state.status = 'connecting'
			state.error = null
		},
		connected: (state) => {
			state.status = 'connected'
			state.error = null
		},
		disconnected: (state) => {
			state.status = 'disconnected'
		},
		connectionError: (state, action: PayloadAction<string>) => {
			state.status = 'error'
			state.error = action.payload
		}
	}
})

export const {
	connecting,
	connected,
	disconnected,
	connectionError
} = connectionSlice.actions

export default connectionSlice.reducer 