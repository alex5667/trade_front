/**
 * Connection Slice
 * ------------------------------
 * Redux slice for WebSocket connection state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConnectionState } from '../signal.types'

const initialState: ConnectionState = {
	isConnected: false,
	lastError: null
}

export const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		setConnectionStatus: (state, action: PayloadAction<boolean>) => {
			console.log(`🔌 Setting connection status to ${action.payload ? 'connected' : 'disconnected'}`)
			state.isConnected = action.payload

			// Clear error when connected
			if (action.payload) {
				state.lastError = null
			}
		},
		setConnectionError: (state, action: PayloadAction<string | null>) => {
			console.log(`❌ Connection error: ${action.payload || 'cleared'}`)
			state.lastError = action.payload

			// Set disconnected when error occurs
			if (action.payload) {
				state.isConnected = false
			}
		},
		connected: (state) => {
			console.log('🔌 Connection status set to connected')
			state.isConnected = true
			state.lastError = null
		},
		connecting: (state) => {
			console.log('🔄 Connection status set to connecting')
			state.isConnected = false
			state.lastError = null
		},
		disconnected: (state) => {
			console.log('❌ Connection status set to disconnected')
			state.isConnected = false
		}
	}
})

export const {
	setConnectionStatus,
	setConnectionError,
	connected,
	connecting,
	disconnected
} = connectionSlice.actions

export default connectionSlice.reducer 