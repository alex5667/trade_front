/**
 * Расширение типов Window для отладки
 */

import type { TypeRootState } from '@/store/store'
import type { Store } from '@reduxjs/toolkit'

declare global {
	interface Window {
		// Redux Store для отладки
		store?: Store<TypeRootState>

		// Socket.IO Debug
		__socketStats?: () => {
			reconnectAttempts: number
			connected: boolean
			isConnecting: boolean
			url: string
		}
		__socketClient?: any

		// WebSocket Debug Utils
		__debugWS?: () => void
		__debugWebSocket?: {
			checkWebSocketConnection: () => void
			checkReduxStore: () => TypeRootState | null
			listenForSignals: () => void
			sendTestPing: () => void
			checkAll: () => TypeRootState | null
		}

		// Redux DevTools
		__REDUX_DEVTOOLS_EXTENSION__?: {
			instances: Map<any, any>
			getState?: () => TypeRootState
		}
	}
}

export { }

