export type CryptoSymbol = string // Example: "BTCUSDT"

export interface CoinBase {
	symbol: CryptoSymbol
	price: number
	exchange?: string
}

export interface TimeframeCoin extends CoinBase {
	changePercent: number
}

export interface VolumeCoin extends CoinBase {
	volumeChangePercent: number
}

export interface FundingCoin extends CoinBase {
	fundingRate: number
}

export interface VolatilityCoin extends CoinBase {
	volatility: number
	lastCandle?: CandleData
}

export interface CandleData {
	open: number
	high: number
	low: number
	close: number
	volume: number
	timestamp: number
}

export interface PriceChangeData {
	symbol: CryptoSymbol
	price: number
	priceChange: number
	percentChange: number
	exchange?: string
}

export interface VolumeChangeData {
	symbol: CryptoSymbol
	volume: number
	volumeChange: number
	percentChange: number
	exchange?: string
}

export interface VolatilitySignal {
	symbol: CryptoSymbol
	volatility: number
	price: number
	timestamp: number
	exchange?: string
}

export interface ConnectEvent {
	type: 'connect'
}

export interface DisconnectEvent {
	type: 'disconnect'
	code: number
	reason: string
}

export interface ErrorEvent {
	type: 'error'
	error: Error
}

export interface TimeframeTopData {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
}

export interface Timeframe5MinData {
	gainers: TimeframeCoin[]
	losers: TimeframeCoin[]
	volume: VolumeCoin[]
	funding: FundingCoin[]
}

// Signal types for useSignalSocket hook
export enum SignalType {
	Volatility = 'volatility',
	Volume = 'volume',
	PriceChange = 'priceChange',
	Timeframe = 'timeframe',
}

// Connection status tracking
export enum ConnectionStatus {
	Disconnected = 'disconnected',
	Connecting = 'connecting',
	Connected = 'connected',
	Reconnecting = 'reconnecting',
	Failed = 'failed',
}

// Combined type for all possible signal data
export type SignalData =
	| VolatilitySignal
	| VolumeChangeData
	| PriceChangeData
	| TimeframeTopData
	| Timeframe5MinData

// Interface for the hook result including all timeframe data
export interface UseSignalSocketResult {
	connectionStatus: ConnectionStatus
	connect: () => void
	disconnect: () => void
	subscribe: (signalType: SignalType, callback: (data: SignalData) => void) => void
	unsubscribe: (signalType: SignalType, callback: (data: SignalData) => void) => void
	volatilitySignals: VolatilitySignal[]
	volumeSignals: VolumeChangeData[]
	priceChangeSignals: PriceChangeData[]
	timeframeData: TimeframeTopData | null
	timeframe5MinData: Timeframe5MinData | null
	timeframe1hData: TimeframeTopData | null
	timeframe4hData: TimeframeTopData | null
	timeframe24hData: TimeframeTopData | null
	topGainers5min?: TimeframeCoin[]
	topLosers5min?: TimeframeCoin[]
	topVolume5min?: TimeframeCoin[]
	topFunding5min?: TimeframeCoin[]
	error: Error | null
} 