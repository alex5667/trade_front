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
	reconnecting: boolean
	reconnectAttempts: number
}

const initialState: ConnectionState = {
	status: 'disconnected',
	error: null,
	reconnecting: false,
	reconnectAttempts: 0
}

export const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		connecting: (state) => {
			state.status = 'connecting'
			state.error = null
			state.reconnecting = false
		},
		connected: (state) => {
			state.status = 'connected'
			state.error = null
			state.reconnecting = false
			state.reconnectAttempts = 0
		},
		disconnected: (state) => {
			state.status = 'disconnected'
			state.reconnecting = false
		},
		reconnecting: (state, action: PayloadAction<number>) => {
			state.status = 'disconnected'
			state.reconnecting = true
			state.reconnectAttempts = action.payload
		},
		connectionError: (state, action: PayloadAction<string>) => {
			state.status = 'error'
			state.error = action.payload
			state.reconnecting = false
		},
		// Special action to handle direct boolean values from ws.isConnected
		setConnectionStatus: (state, action: PayloadAction<boolean>) => {
			if (action.payload === true) {
				state.status = 'connected'
				state.error = null
				state.reconnecting = false
				state.reconnectAttempts = 0
			} else {
				// Only set to disconnected if not currently in error state
				// This prevents overwriting error information
				if (state.status !== 'error') {
					state.status = 'disconnected'
				}
			}
		}
	}
})

export const {
	connecting,
	connected,
	disconnected,
	reconnecting,
	connectionError,
	setConnectionStatus
} = connectionSlice.actions

export default connectionSlice.reducer 