/**
 * Хук useSignalSocket
 * ------------------------------
 * React хук для подписки на WebSocket сервер и получения торговых сигналов.
 * 
 * Основные функции:
 * - Подключение к бэкенду по WebSocket
 * - Прием множества типов событий (волатильность, объем, изменения цены)
 * - Обработка топ-списков гейнеров/лузеров за разные периоды
 * - Управление кастомными триггер-каналами для различных таймфреймов
 * - Сохранение событий в соответствующие состояния с ограничением записей
 * - Предоставление данных для UI компонентов
 * 
 * @deprecated Этот хук оставлен для обратной совместимости.
 * Рекомендуется использовать useSignalSocketInitializer + Redux селекторы.
 */
'use client'

import { useSelector } from 'react-redux'

import {
	selectConnectionStatus,
	selectPriceChangeSignals,
	selectTimeframe24hData,
	selectTimeframe5minData,
	selectTrigger24hData,
	selectTrigger5minData,
	selectVolatilitySignals,
	selectVolumeSignals
} from '@/store/signals/selectors/signals.selectors'
import { useSignalSocketInitializer } from './useSignalSocketInitializer'

/**
 * Клиент для работы с WebSocket сигналами
 * 
 * Использует нативный WebSocket API браузера для установки
 * соединения с сервером торговых сигналов. Реализует логику
 * переподключения и обработки различных типов событий.
 * 
 * @deprecated Используется только для обратной совместимости
 */
class TradeSignalClient {
	/** Базовый URL WebSocket сервера */
	baseUrl: string
	/** Экземпляр WebSocket соединения */
	socket: WebSocket | null
	/** Флаг состояния соединения */
	isConnected: boolean
	/** Счетчик попыток переподключения */
	reconnectAttempts: number
	/** Максимальное количество попыток переподключения */
	maxReconnectAttempts: number
	/** Задержка между попытками переподключения (мс) */
	reconnectDelay: number
	/** Объект с коллбэками для различных событий */
	callbacks: Record<string, Function[]>

	/**
	 * Конструктор WebSocket клиента
	 * 
	 * @param baseUrl - URL WebSocket сервера (по умолчанию localhost:4200)
	 */
	constructor(baseUrl = 'ws://localhost:4200') {
		this.baseUrl = baseUrl
		this.socket = null
		this.isConnected = false
		this.reconnectAttempts = 0
		this.maxReconnectAttempts = 5
		this.reconnectDelay = 3000

		// Инициализация коллбэков для различных типов событий
		this.callbacks = {
			'top:gainers:5min': [], // Топ растущих за 5 минут
			'top:losers:5min': [], // Топ падающих за 5 минут
			'top:volume:5min': [], // Топ по объему за 5 минут
			'top:funding:5min': [], // Топ по финансированию за 5 минут
			'top:gainers:24h': [], // Топ растущих за 24 часа
			'top:losers:24h': [], // Топ падающих за 24 часа
			'signal:volatility': [], // Сигналы волатильности
			'signal:volatilityRange': [], // Сигналы диапазона волатильности
			'volatilitySpike': [], // Всплески волатильности
			'volatilityRange': [], // Диапазоны волатильности
			'volumeSpike': [], // Всплески объема
			'priceChange': [], // Изменения цены
			'top:gainers': [], // Топ растущих (общие)
			'top:losers': [], // Топ падающих (общие)
			'trigger:gainers-24h': [], // Триггер для растущих за 24 часа
			'trigger:losers-24h': [], // Триггер для падающих за 24 часа
			'trigger:gainers-5min': [], // Триггер для растущих за 5 минут
			'trigger:losers-5min': [], // Триггер для падающих за 5 минут
			'trigger:volume-5min': [], // Триггер для объема за 5 минут
			'trigger:funding-5min': [], // Триггер для финансирования за 5 минут
			'connect': [], // Событие подключения
			'disconnect': [], // Событие отключения
			'error': [] // Событие ошибки
		}
	}

	/**
	 * Подключиться к WebSocket серверу
	 * 
	 * Устанавливает соединение с WebSocket сервером и настраивает
	 * обработчики событий для получения торговых сигналов.
	 */
	connect() {
		// Закрываем существующее соединение если есть
		if (this.socket) {
			console.log('Сокет уже существует, закрываем предыдущее соединение')
			this.socket.close()
		}

		try {
			// Подключение к WebSocket серверу
			this.socket = new WebSocket(`${this.baseUrl}`)

			// Обработчик успешного подключения
			this.socket.onopen = () => {
				console.log('✅ WebSocket успешно подключен')
				this.isConnected = true
				this.reconnectAttempts = 0
				this._emitEvent('connect')
			}

			// Обработчик входящих сообщений
			this.socket.onmessage = (event) => {
				try {
					const message = JSON.parse(event.data)
					const { event: eventType, data } = message

					console.log(`Получено событие ${eventType}`, data)
					this._emitEvent(eventType, data)
				} catch (err) {
					console.error('Ошибка при разборе сообщения:', err)
				}
			}

			// Обработчик закрытия соединения
			this.socket.onclose = (event) => {
				console.log('⚠️ WebSocket соединение закрыто', event)
				this.isConnected = false
				this._emitEvent('disconnect')
				this._tryReconnect()
			}

			// Обработчик ошибок WebSocket
			this.socket.onerror = (error) => {
				// WebSocket события ошибок не предоставляют детальную информацию
				// Вместо этого логируем полезный контекст о состоянии соединения
				const errorInfo = {
					timestamp: new Date().toISOString(),
					readyState: this.socket?.readyState,
					readyStateText: this.socket?.readyState !== undefined ?
						['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.socket.readyState] : 'UNKNOWN',
					url: this.baseUrl,
					reconnectAttempts: this.reconnectAttempts,
					errorType: error?.type || 'unknown',
					errorTarget: error?.target?.constructor?.name || 'unknown'
				}

				console.error('❌ Произошла ошибка WebSocket:', errorInfo)

				// Логируем дополнительный контекст если доступен
				if (error instanceof Event) {
					console.error('❌ Детали события ошибки:', {
						type: error.type,
						timeStamp: error.timeStamp,
						isTrusted: error.isTrusted
					})
				}

				this._emitEvent('error', {
					message: 'Ошибка WebSocket соединения',
					details: errorInfo
				})
			}
		} catch (error) {
			// Обработка ошибок при создании WebSocket соединения
			const errorInfo = {
				timestamp: new Date().toISOString(),
				url: this.baseUrl,
				reconnectAttempts: this.reconnectAttempts,
				errorMessage: error instanceof Error ? error.message : String(error),
				errorName: error instanceof Error ? error.name : 'Unknown',
				errorStack: error instanceof Error ? error.stack : undefined
			}

			console.error('❌ Ошибка при установке WebSocket соединения:', errorInfo)

			this._emitEvent('error', {
				message: 'Не удалось установить WebSocket соединение',
				details: errorInfo
			})
			this._tryReconnect()
		}
	}

	/**
	 * Отключиться от WebSocket сервера
	 * 
	 * Корректно закрывает WebSocket соединение и очищает состояние.
	 */
	disconnect() {
		if (this.socket) {
			this.socket.close()
			this.socket = null
			this.isConnected = false
		}
	}

	/**
	 * Попытка переподключения при обрыве соединения
	 * 
	 * Реализует логику автоматического переподключения с
	 * увеличивающейся задержкой между попытками.
	 * 
	 * @private
	 */
	_tryReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++
			console.log(
				`🔄 Попытка переподключения (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
			)

			// Увеличиваем задержку с каждой попыткой
			setTimeout(() => {
				this.connect()
			}, this.reconnectDelay * this.reconnectAttempts)
		} else {
			console.error(
				'⛔ Достигнуто максимальное количество попыток переподключения. Проверьте соединение.'
			)
		}
	}

	/**
	 * Подписаться на событие WebSocket
	 * 
	 * Добавляет функцию обратного вызова для указанного типа события.
	 * 
	 * @param eventName - Название события
	 * @param callback - Функция обратного вызова
	 * @returns Экземпляр клиента для цепочки вызовов
	 */
	on(eventName: string, callback: Function) {
		if (!this.callbacks[eventName]) {
			this.callbacks[eventName] = []
		}
		this.callbacks[eventName].push(callback)
		return this
	}

	/**
	 * Отписаться от события WebSocket
	 * 
	 * Удаляет указанную функцию обратного вызова из списка
	 * подписчиков на событие.
	 * 
	 * @param eventName - Название события
	 * @param callback - Функция обратного вызова для удаления
	 * @returns Экземпляр клиента для цепочки вызовов
	 */
	off(eventName: string, callback: Function) {
		if (this.callbacks[eventName]) {
			this.callbacks[eventName] = this.callbacks[eventName].filter(
				(cb) => cb !== callback
			)
		}
		return this
	}

	/**
	 * Проверить состояние соединения
	 * 
	 * @returns true если соединение установлено и активно
	 */
	isActive(): boolean {
		return (
			this.isConnected &&
			this.socket !== null &&
			this.socket.readyState === WebSocket.OPEN
		)
	}

	/**
	 * Вызвать обработчики события
	 * 
	 * Безопасно вызывает все зарегистрированные обработчики
	 * для указанного события.
	 * 
	 * @param eventName - Название события
	 * @param data - Данные события (опционально)
	 * @private
	 */
	_emitEvent(eventName: string, data?: any) {
		if (this.callbacks[eventName]) {
			this.callbacks[eventName].forEach((callback) => {
				try {
					callback(data)
				} catch (err) {
					console.error(`Ошибка в коллбэке для события ${eventName}:`, err)
				}
			})
		}
	}
}

/**
 * URL WebSocket сервера
 * 
 * Берется из переменной окружения для возможности
 * легкого переключения между dev/prod окружениями.
 */
const SOCKET_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:4200'

/** Вспомогательный тип для объектов произвольной формы */
type AnyObject = { [key: string]: any }

/**
 * Хук useSignalSocket
 * ------------------------------
 * Хук для использования данных сигналов из Redux хранилища.
 * Совместим с существующим кодом, который использовал предыдущую версию хука.
 * 
 * Инициализирует WebSocket соединение и предоставляет доступ к данным
 * через Redux селекторы. Возвращает объект с данными сигналов в формате,
 * совместимом со старой версией API.
 * 
 * @returns Объект с данными торговых сигналов и состоянием соединения
 */
export const useSignalSocket = () => {
	// Инициализируем WebSocket соединение
	useSignalSocketInitializer()

	// Получаем данные из Redux селекторов
	const connectionStatus = useSelector(selectConnectionStatus)
	const volatilitySignals = useSelector(selectVolatilitySignals)
	const volumeSignals = useSelector(selectVolumeSignals)
	const priceChangeSignals = useSelector(selectPriceChangeSignals)

	const timeframe5min = useSelector(selectTimeframe5minData)
	const timeframe24h = useSelector(selectTimeframe24hData)
	const trigger5min = useSelector(selectTrigger5minData)
	const trigger24h = useSelector(selectTrigger24hData)

	// Структура интерфейса для обратной совместимости
	return {
		/** Статус WebSocket соединения */
		connectionStatus,
		/** Массив сигналов волатильности */
		volatilitySignals,
		/** Массив сигналов объема */
		volumeSignals,
		/** Массив сигналов изменения цены */
		priceChangeSignals,

		// Данные за 5 минут
		/** Топ растущих активов за 5 минут */
		topGainers5min: timeframe5min.gainers,
		/** Топ падающих активов за 5 минут */
		topLosers5min: timeframe5min.losers,
		/** Топ по объему за 5 минут */
		topVolume5min: timeframe5min.volume,
		/** Топ по финансированию за 5 минут */
		topFunding5min: timeframe5min.funding,

		// Данные за 24 часа
		/** Топ растущих активов за 24 часа */
		topGainers24h: timeframe24h.gainers,
		/** Топ падающих активов за 24 часа */
		topLosers24h: timeframe24h.losers,

		// Триггерные данные за 5 минут
		/** Триггеры для растущих активов за 5 минут */
		triggerGainers5min: trigger5min.gainers,
		/** Триггеры для падающих активов за 5 минут */
		triggerLosers5min: trigger5min.losers,
		/** Триггеры для объема за 5 минут */
		triggerVolume5min: trigger5min.volume,
		/** Триггеры для финансирования за 5 минут */
		triggerFunding5min: trigger5min.funding,

		// Триггерные данные за 24 часа
		/** Триггеры для растущих активов за 24 часа */
		triggerGainers24h: trigger24h.gainers,
		/** Триггеры для падающих активов за 24 часа */
		triggerLosers24h: trigger24h.losers
	}
} 