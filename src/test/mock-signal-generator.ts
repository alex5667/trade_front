'use client'

import {
	PriceChangeSignal,
	TimeframeCoin,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'
import {
	addPriceChangeSignal,
	addTimeframeGainer,
	addTimeframeLoser,
	addVolatilitySignal,
	addVolumeSignal,
	setConnectionStatus
} from '@/store/signals/signals.slice'
import { store } from '@/store/store'

// Symbol pool for mock data
const SYMBOLS = [
	'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'AVAXUSDT', 'BNBUSDT',
	'ADAUSDT', 'DOTUSDT', 'DOGEUSDT', 'MATICUSDT', 'ATOMUSDT'
]

// Generate random number between min and max
const randomNumber = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

// Generate random integer between min and max
const randomInt = (min: number, max: number) => {
	return Math.floor(randomNumber(min, max))
}

// Pick a random symbol from the pool
const randomSymbol = () => {
	return SYMBOLS[randomInt(0, SYMBOLS.length)]
}

// Generate a mock volatility signal
const generateVolatilitySignal = (): VolatilitySignal => {
	const volatility = randomNumber(0.5, 5)
	const volatilityChange = randomNumber(5, 50)

	return {
		type: 'volatility',
		signalType: 'volatilitySpike',
		symbol: randomSymbol(),
		exchange: 'binance',
		timestamp: Date.now(),
		price: randomNumber(10000, 70000),
		volatility,
		volatilityChange,
		interval: '5m'
	}
}

// Generate a mock volume signal
const generateVolumeSignal = (): VolumeSignal => {
	const volume = randomNumber(1000000, 10000000)
	const volumeChange = randomNumber(20, 100)

	return {
		type: 'volume',
		signalType: 'volumeSpike',
		symbol: randomSymbol(),
		exchange: 'binance',
		timestamp: Date.now(),
		price: randomNumber(10000, 70000),
		volume,
		volumeChange,
		volumeChangePercent: volumeChange,
		avgVolume: volume / (1 + volumeChange / 100),
		interval: '5m'
	}
}

// Generate a mock price change signal
const generatePriceChangeSignal = (): PriceChangeSignal => {
	const priceChangePercent = randomNumber(1, 7)
	const direction = Math.random() > 0.5 ? 'up' : 'down'
	const price = randomNumber(10000, 70000)

	return {
		type: 'priceChange',
		signalType: 'priceSpike',
		symbol: randomSymbol(),
		exchange: 'binance',
		timestamp: Date.now(),
		price,
		priceChange: price * (priceChangePercent / 100),
		priceChangePercent,
		interval: '5m',
		direction
	}
}

// Generate a mock timeframe coin
const generateTimeframeCoin = (direction: 'up' | 'down'): TimeframeCoin => {
	const percentChange = direction === 'up'
		? randomNumber(1, 15)
		: -randomNumber(1, 15)

	return {
		symbol: randomSymbol(),
		exchange: 'binance',
		timestamp: Date.now(),
		price: randomNumber(10000, 70000),
		percentChange,
		direction
	}
}

// Start generating mock signals
export const startMockSignalGenerator = () => {
	console.log('Starting mock signal generator...')

	// Set connection status to connected
	store.dispatch(setConnectionStatus(true))

	// Generate volatility signals
	const volatilityInterval = setInterval(() => {
		const signal = generateVolatilitySignal()
		store.dispatch(addVolatilitySignal(signal))
		console.log('Generated volatility signal:', signal)
	}, 8000)

	// Generate volume signals
	const volumeInterval = setInterval(() => {
		const signal = generateVolumeSignal()
		store.dispatch(addVolumeSignal(signal))
		console.log('Generated volume signal:', signal)
	}, 10000)

	// Generate price change signals
	const priceInterval = setInterval(() => {
		const signal = generatePriceChangeSignal()
		store.dispatch(addPriceChangeSignal(signal))
		console.log('Generated price change signal:', signal)
	}, 6000)

	// Generate top gainers 24h
	const gainers24hInterval = setInterval(() => {
		const coin = generateTimeframeCoin('up')
		store.dispatch(addTimeframeGainer({ timeframe: '24h', data: coin }))
		console.log('Generated 24h gainer:', coin)
	}, 5000)

	// Generate top losers 24h
	const losers24hInterval = setInterval(() => {
		const coin = generateTimeframeCoin('down')
		store.dispatch(addTimeframeLoser({ timeframe: '24h', data: coin }))
		console.log('Generated 24h loser:', coin)
	}, 5500)

	// Return cleanup function
	return () => {
		clearInterval(volatilityInterval)
		clearInterval(volumeInterval)
		clearInterval(priceInterval)
		clearInterval(gainers24hInterval)
		clearInterval(losers24hInterval)
		store.dispatch(setConnectionStatus(false))
		console.log('Mock signal generator stopped')
	}
} 