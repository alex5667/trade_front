import { VolatilitySignal } from '@/store/signals/signal.types'

export const normalizeVolatilitySignal = (data: any): VolatilitySignal => {
	if (data.type === 'volatilitySpike' || data.type === 'volatilityRange') {
		return {
			...data,
			type: 'volatility',
			signalType: data.type, // 'volatilitySpike' | 'volatilityRange'
		}
	}
	return data
} 