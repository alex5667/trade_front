// 'use client' tells Next.js this hook runs in the browser
'use client'

/*******************************************************
 * useSignalSocket – React hook for subscribing to the
 * Socket.IO server on the `/signals` namespace.
 * ----------------------------------------------------
 * ▸ Подключается к BACKEND‑у по WebSocket (Socket.IO).
 * ▸ Принимает множество типов событий (volatility,
 *   volumeSpike, priceChange, топ‑гейнеры/лузеры,
 *   а также кастомные «trigger»‑каналы для 1h/4h/24h).
 * ▸ Каждое событие сохраняется в соответствующее
 *   состояние (useState) с ограничением 100 записей
 *   (0‑я позиция – самая новая).
 * ▸ Возвращает объект SignalData для использования
 *   в UI‑компонентах (Dashboards / Tables / Charts).
 ******************************************************/

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

import {
	PriceChangeSignal,
	SignalData,
	TopGainersSignal,
	TopLosersSignal,
	VolatilitySpikeSignal,
	VolumeSpikeSignal
} from '@/types/signal.types'

/**
 * URL WebSocket‑сервера берём из env‑переменной, чтобы
 * можно было легко переключать dev / prod окружения.
 */
const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4200'

/**
 * Вспомогательный тип, чтобы TypeScript не ругался, когда
 * приходят данные произвольной формы (payload / coins / массив).
 */
type AnyObject = { [key: string]: any }

export function useSignalSocket(): SignalData {
	/*********************************
	 * refs & state
	 *********************************/
	const socketRef = useRef<Socket | null>(null)

	// ▼ Основные массивы сигналов (ограничены 100 эл.)
	const [volatilitySpikes, setVolatilitySpikes] =
		useState<VolatilitySpikeSignal[]>([])
	const [volatilityRanges, setVolatilityRanges] =
		useState<VolatilitySpikeSignal[]>([])
	const [volumeSpikes, setVolumeSpikes] = useState<VolumeSpikeSignal[]>([])
	const [priceChanges, setPriceChanges] = useState<PriceChangeSignal[]>([])

	// ▼ Списки топ‑монет (только символы)
	const [topGainers, setTopGainers] = useState<string[]>([])
	const [topLosers, setTopLosers] = useState<string[]>([])

	// ▼ «Триггерные» списки по таймфреймам (1h / 4h / 24h)
	const [triggerGainers1h, setTriggerGainers1h] = useState<string[]>([])
	const [triggerLosers1h, setTriggerLosers1h] = useState<string[]>([])
	const [triggerGainers4h, setTriggerGainers4h] = useState<string[]>([])
	const [triggerLosers4h, setTriggerLosers4h] = useState<string[]>([])
	const [triggerGainers24h, setTriggerGainers24h] = useState<string[]>([])
	const [triggerLosers24h, setTriggerLosers24h] = useState<string[]>([])

	/**
	 * push – универсальная функция добавления элемента
	 * в «скользящее» окно последних 100 записей.
	 */
	const push = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: T) => {
		setter(prev => [item, ...prev.slice(0, 99)])
	}

	/*********************************
	 * socket lifecycle
	 *********************************/
	useEffect(() => {
		console.log('🚀 Connecting to WebSocket at:', SOCKET_URL)

		// Создаём подключение к namespace `/signals`
		const socket: Socket = io(`${SOCKET_URL}/signals`, {
			transports: ['websocket', 'polling'], // fallback на polling
			reconnectionAttempts: 5, // 5 попыток переподключения
			path: '/socket.io',
		})

		socketRef.current = socket

		/* === Events for connection state === */
		socket.on('connect', () => console.log('✅ WebSocket connected:', socket.id))
		socket.on('connect_error', err => console.error('❌ Socket error:', err.message))
		socket.on('disconnect', reason => console.log('⚠️ Socket disconnected:', reason))

		/* === Market‑signal handlers === */

		// 1. Волатильность (спайки)
		socket.on('signal:volatility', (s: VolatilitySpikeSignal) => {
			if (s.type === 'volatilitySpike') push(setVolatilitySpikes, s)
		})
		socket.on('volatility', (s: VolatilitySpikeSignal) => push(setVolatilitySpikes, s))
		socket.on('volatilitySpike', (s: VolatilitySpikeSignal) => push(setVolatilitySpikes, s))

		// 2. Диапазон‑волатильность (high‑low range)
		socket.on('signal:volatilityRange', (s: VolatilitySpikeSignal) => push(setVolatilityRanges, s))
		socket.on('volatilityRange', (s: VolatilitySpikeSignal) => push(setVolatilityRanges, s))

		// 3. Объёмные всплески & изменения цены
		socket.on('volumeSpike', (s: VolumeSpikeSignal) => push(setVolumeSpikes, s))
		socket.on('priceChange', (s: PriceChangeSignal) => push(setPriceChanges, s))

		// 4. Топ‑гейнеры / лузеры (потенциально в разных форматах)
		socket.on('top:gainers', (d: TopGainersSignal | string[] | AnyObject) => {
			setTopGainers(parseSymbols(d))
		})
		socket.on('top:losers', (d: TopLosersSignal | string[] | AnyObject) => {
			setTopLosers(parseSymbols(d))
		})

		// 5. Триггер‑каналы для 1h / 4h / 24h (символы‑кандидаты)
		socket.on('trigger:gainers-1h', d => setTriggerGainers1h(parseSymbols(d)))
		socket.on('trigger:losers-1h', d => setTriggerLosers1h(parseSymbols(d)))

		socket.on('trigger:gainers-4h', d => setTriggerGainers4h(parseSymbols(d)))
		socket.on('trigger:losers-4h', d => setTriggerLosers4h(parseSymbols(d)))

		socket.on('trigger:gainers-24h', d => setTriggerGainers24h(parseSymbols(d)))
		socket.on('trigger:losers-24h', d => setTriggerLosers24h(parseSymbols(d)))

		/**
		 * Legacy handler: если прилетает «сырой» kline‑объект
		 * от Binance, преобразуем в VolatilitySpikeSignal.
		 */
		socket.on('binance:kline', raw => {
			if (!raw?.k) return
			const k = raw.k
			const volatility = ((parseFloat(k.h) - parseFloat(k.l)) / parseFloat(k.o)) * 100

			const sig: VolatilitySpikeSignal = {
				type: 'volatilityRange',
				symbol: k.s,
				interval: k.i,
				open: parseFloat(k.o),
				high: parseFloat(k.h),
				low: parseFloat(k.l),
				close: parseFloat(k.c),
				volatility: +volatility.toFixed(2),
				timestamp: k.t,
			}
			push(setVolatilityRanges, sig)
		})

		// → Чистим сокет при размонтировании
		return () => {
			console.log('🛑 Disconnecting socket')
			socket.disconnect()
		}
	}, [])

	/*********************************
	 * Helpers
	 *********************************/
	/**
	 * Разбираем разнообразные форматы «топ‑монет» из бекенда:
	 * – массив строк
	 * – объект { payload: [...] }
	 * – объект { coins: [...] } где элемент может быть string | {symbol}
	 */
	const parseSymbols = (data: any): string[] => {
		if (data && typeof data === 'object' && 'payload' in data && Array.isArray(data.payload)) {
			return data.payload
		}
		if (Array.isArray(data)) {
			return data.map(item => (typeof item === 'string' ? item : (item as AnyObject).symbol || ''))
		}
		if (data && typeof data === 'object' && Array.isArray((data as AnyObject).coins)) {
			return (data as AnyObject).coins.map((c: any) => (typeof c === 'string' ? c : c.symbol))
		}
		return []
	}

	/*********************************
	 * Возвращаем срез состояния наружу
	 *********************************/
	return {
		volatilitySpikes,
		volatilityRanges,
		volumeSpikes,
		priceChanges,
		topGainers,
		topLosers,
		triggerGainers1h,
		triggerLosers1h,
		triggerGainers4h,
		triggerLosers4h,
		triggerGainers24h,
		triggerLosers24h,
	}
}
