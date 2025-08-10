# Исправление автоматического получения данных таймфреймов

## Проблема

Компоненты **Top Gainers** и **Top Losers** не получали данные автоматически с бэкенда при пустом store. Данные обновлялись только при получении WebSocket событий, но не было начального запроса данных.

## Причины проблемы

1. **Отсутствие начального запроса**: Компоненты ждали WebSocket события, но не запрашивали текущие данные при инициализации
2. **Только реактивная модель**: Данные обновлялись только при получении событий от бэкенда
3. **Нет fallback механизма**: При проблемах с WebSocket не было альтернативного способа получения данных

## Решение

### 1. Автоматический запрос данных при подключении

Добавлен автоматический запрос данных в `socket-io.service.ts`:

```typescript
// Автоматически запрашиваем данные при подключении
this.socket.on('connect', () => {
	console.log('✅ Socket.IO успешно подключен, ID:', this.socket?.id)
	this.isConnected = true
	this.isConnecting = false
	this.reconnectAttempts = 0
	this._emitEvent('connect')

	// Автоматически запрашиваем данные при подключении
	console.log('🔄 Запрашиваем начальные данные при подключении...')
	this.socket?.emit('request:top-gainers')
	this.socket?.emit('request:top-losers')
})
```

### 2. Обработчики для событий запроса

Добавлены обработчики в `signal.service.ts` и `useSignalSocketInitializer.ts`:

```typescript
// Обработчики для запросов данных (если бэкенд поддерживает)
client.on('response:top-gainers', (data: AnyObject) => {
	console.log('Получен ответ на запрос top-gainers:', data)
	const coins = parseTimeframeCoins(data)
	dispatch(replaceTimeframeGainers({ data: coins }))
})

client.on('response:top-losers', (data: AnyObject) => {
	console.log('Получен ответ на запрос top-losers:', data)
	const coins = parseTimeframeCoins(data)
	dispatch(replaceTimeframeLosers({ data: coins }))
})
```

### 3. HTTP API как fallback

Создан хук `useTimeframeData` с HTTP API как альтернативой WebSocket:

```typescript
export const useTimeframeData = () => {
	const dispatch = useDispatch()
	const timeframeData = useSelector(selectTimeframeData)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Функция для запроса данных через HTTP API
	const fetchTimeframeData = async () => {
		if (isLoading) return

		setIsLoading(true)
		setError(null)

		try {
			// Пытаемся получить данные через HTTP API как fallback
			const [gainersResponse, losersResponse] = await Promise.allSettled([
				fetch('/api/timeframe/gainers'),
				fetch('/api/timeframe/losers')
			])

			// Обрабатываем ответы
			if (gainersResponse.status === 'fulfilled' && gainersResponse.value.ok) {
				const gainersData = await gainersResponse.value.json()
				dispatch(replaceTimeframeGainers({ data: gainersData.data || [] }))
			}

			if (losersResponse.status === 'fulfilled' && losersResponse.value.ok) {
				const losersData = await losersResponse.value.json()
				dispatch(replaceTimeframeLosers({ data: losersData.data || [] }))
			}
		} catch (err) {
			console.error('Ошибка при запросе данных таймфреймов:', err)
			setError('Не удалось загрузить данные')
		} finally {
			setIsLoading(false)
		}
	}

	// Автоматически запрашиваем данные, если их нет
	useEffect(() => {
		const hasData =
			timeframeData.gainers.length > 0 || timeframeData.losers.length > 0

		if (!hasData && !isLoading) {
			console.log('🔄 Данные таймфреймов отсутствуют, запрашиваем через API...')
			fetchTimeframeData()
		}
	}, [timeframeData.gainers.length, timeframeData.losers.length, isLoading])

	return {
		timeframeData,
		isLoading,
		error,
		refetch: fetchTimeframeData
	}
}
```

### 4. API роуты Next.js

Созданы API роуты для получения данных:

- `/api/timeframe/gainers` - получение топ-гайнеров
- `/api/timeframe/losers` - получение топ-лузеров

### 5. Обновленный компонент TimeframeCoinsTable

Компонент теперь использует новый хук и показывает состояние загрузки:

```typescript
export const TimeframeCoinsTable = ({
    title,
    type
}: TimeframeCoinsTableProps) => {
    const { timeframeData, isLoading, error } = useTimeframeData()

    const coins = useMemo(() => {
        if (!timeframeData || !timeframeData[type]) return []
        return timeframeData[type]
    }, [timeframeData, type])

    const hasData = useMemo(() => coins.length > 0, [coins])

    return (
        <div className={styles.tableContainer}>
            <h3 className={styles.tableTitle}>{title}</h3>
            {isLoading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Загрузка данных...</p>
                </div>
            ) : error ? (
                <div className="text-center py-4 text-red-500">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Обновить
                    </button>
                </div>
            ) : hasData ? (
                <table className={styles.timeframeTable}>
                    {/* ... содержимое таблицы ... */}
                </table>
            ) : (
                <NoDataIndicator />
            )}
        </div>
    )
}
```

## Результат

Теперь компоненты **Top Gainers** и **Top Losers**:

1. ✅ **Автоматически запрашивают данные** при подключении WebSocket
2. ✅ **Показывают состояние загрузки** во время получения данных
3. ✅ **Имеют fallback механизм** через HTTP API
4. ✅ **Обрабатывают ошибки** и предоставляют возможность повторной загрузки
5. ✅ **Получают данные сразу** при инициализации, а не только при WebSocket событиях

## Требования к бэкенду

Для полной работы решения бэкенд должен поддерживать:

1. **WebSocket события**:

   - `request:top-gainers` - запрос данных топ-гайнеров
   - `request:top-losers` - запрос данных топ-лузеров
   - `response:top-gainers` - ответ с данными топ-гайнеров
   - `response:top-losers` - ответ с данными топ-лузеров

2. **HTTP API endpoints**:
   - `GET /api/timeframe/gainers` - получение топ-гайнеров
   - `GET /api/timeframe/losers` - получение топ-лузеров

Если бэкенд не поддерживает эти события, данные будут загружаться только через HTTP API fallback.
