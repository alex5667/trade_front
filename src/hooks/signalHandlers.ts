'use strict'

import {
	PriceChangeSignal,
	TimeframeCoin,
	VolatilitySignal,
	VolumeSignal
} from '@/store/signals/signal.types'

type Setter<T> = React.Dispatch<React.SetStateAction<T[]>>
type SimpleHandler<T> = (setter: Setter<T>, data: T) => void
type DirectHandler<T> = (data: T) => void

export interface SignalSetters {
	setVolatilitySpikes: Setter<VolatilitySignal>
	setVolatilityRanges: Setter<VolatilitySignal>
	setVolumeSpikes: Setter<VolumeSignal>
	setPriceChanges: Setter<PriceChangeSignal>
	setTopGainers: React.Dispatch<React.SetStateAction<TimeframeCoin[]>>
	setTopLosers: React.Dispatch<React.SetStateAction<TimeframeCoin[]>>
}

// универсальный push
const push = <T>(setter: Setter<T>, item: T) => {
	setter(prev => [item, ...prev.slice(0, 99)])
}

// функция для генерации мапы обработчиков
export const createSignalHandlers = (_setters: SignalSetters): Record<string, (data: any) => void> => ({
	// volumeSpike, top:gainers, top:losers отключены (REST-only)
})
