'use strict'

import {
	PriceChangeSignal,
	TopGainersSignal,
	TopLosersSignal,
	VolatilitySpikeSignal,
	VolumeSpikeSignal
} from '@/types/signal.types'

type Setter<T> = React.Dispatch<React.SetStateAction<T[]>>
type SimpleHandler<T> = (setter: Setter<T>, data: T) => void
type DirectHandler<T> = (data: T) => void

export interface SignalSetters {
	setVolatilitySpikes: Setter<VolatilitySpikeSignal>
	setVolatilityRanges: Setter<VolatilitySpikeSignal>
	setVolumeSpikes: Setter<VolumeSpikeSignal>
	setPriceChanges: Setter<PriceChangeSignal>
	setTopGainers: React.Dispatch<React.SetStateAction<TopGainersSignal['coins']>>
	setTopLosers: React.Dispatch<React.SetStateAction<TopLosersSignal['coins']>>
}

// универсальный push
const push = <T>(setter: Setter<T>, item: T) => {
	setter(prev => [item, ...prev.slice(0, 99)])
}

// функция для генерации мапы обработчиков
export const createSignalHandlers = (setters: SignalSetters) => {
	const {
		setVolatilitySpikes,
		setVolatilityRanges,
		setVolumeSpikes,
		setPriceChanges,
		setTopGainers,
		setTopLosers
	} = setters

	return {
		'signal:volatility': (data: VolatilitySpikeSignal) => push(setVolatilitySpikes, data),
		'signal:volatilityRange': (data: VolatilitySpikeSignal) => push(setVolatilityRanges, data),
		'volatilityRange': (data: VolatilitySpikeSignal) => push(setVolatilityRanges, data),
		'volumeSpike': (data: VolumeSpikeSignal) => push(setVolumeSpikes, data),
		'priceChange': (data: PriceChangeSignal) => push(setPriceChanges, data),
		'top:gainers': (data: any) => setTopGainers((data?.payload || (data as TopGainersSignal)?.coins) || []),
		'top:losers': (data: any) => setTopLosers((data?.payload || (data as TopLosersSignal)?.coins) || []),
	}
}
