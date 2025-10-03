# Исправление дублирования символов в Top Gainers, Top Losers и Volume & Funding

## Проблема

В компонентах **Top Gainers**, **Top Losers** и **Volume & Funding** символы дублировались, что приводило к отображению одинаковых монет несколько раз в таблицах.

## Причины дублирования

### 1. Двойная инициализация данных

- **SignalSocketInitializer** (в layout) использовал `useSignalInitializer()` для получения данных
- **SignalTable** компонент также имел RTK Query хуки и ручную загрузку данных
- Оба компонента обрабатывали одни и те же данные, что приводило к дублированию

### 2. Недостаточная защита от дубликатов в Redux

- Слайсы не проверяли дубликаты по символу при замене данных
- Логика предотвращения дубликатов была слишком строгой (требовала совпадения и символа, и временной метки)

### 3. Множественные источники данных

- RTK Query хуки с автообновлением каждые 30 минут
- WebSocket события
- Ручные запросы данных

## Решение

### 1. Устранение дублирования инициализации

**Удалено из SignalTable:**

- RTK Query хуки (`useGetTopGainersQuery`, `useGetTopLosersQuery`, etc.)
- Ручная загрузка данных через `signalApi.endpoints`
- Автоматическое обновление каждые 30 минут

**Оставлено в SignalSocketInitializer (layout):**

- Единственная точка инициализации данных
- RTK Query хуки с автообновлением
- Обработка всех типов сигналов

### 2. Улучшение защиты от дубликатов в Redux

#### Timeframe Slice (Top Gainers/Losers)

```typescript
replaceTimeframeGainers: (
	state,
	action: PayloadAction<{ data: TimeframeCoin[] }>
) => {
	// Deduplicate gainers by symbol before replacing
	const uniqueGainers = (action.payload.data || []).reduce(
		(acc: TimeframeCoin[], coin) => {
			const existingIndex = acc.findIndex(c => c.symbol === coin.symbol)
			if (existingIndex === -1) {
				acc.push(coin)
			} else {
				// Update existing coin with newer data
				acc[existingIndex] = coin
			}
			return acc
		},
		[]
	)

	state.gainers = uniqueGainers
		.slice()
		.sort((a, b) => b.percentChange - a.percentChange)
		.slice(0, MAX_ITEMS)
}
```

#### Volume Slice

```typescript
addVolumeSignal: (state, action: PayloadAction<VolumeSignalPrisma>) => {
	const signal = action.payload

	// Check for existing signal by symbol only (not timestamp)
	const existingIndex = state.signals.findIndex(
		existingSignal => existingSignal.symbol === signal.symbol
	)

	if (existingIndex !== -1) {
		// Update existing signal instead of adding new one
		state.signals[existingIndex] = {
			...signal,
			createdAt: state.signals[existingIndex].createdAt
		}
	} else {
		// Add new signal
		state.signals.unshift({ ...signal, createdAt: new Date().toISOString() })
	}

	// Sort and limit array size
	state.signals = sortSignalsByVolume(state.signals)
	if (state.signals.length > MAX_SIGNALS) {
		state.signals.length = MAX_SIGNALS
	}
}
```

#### Funding Slice

```typescript
replaceFundingData: (state, action: PayloadAction<FundingCoin[]>) => {
	// Deduplicate funding data by symbol before replacing
	const uniqueCoins = (action.payload || []).reduce(
		(acc: FundingCoin[], coin) => {
			const existingIndex = acc.findIndex(c => c.symbol === coin.symbol)
			if (existingIndex === -1) {
				acc.push(coin)
			} else {
				// Update existing coin with newer data
				acc[existingIndex] = coin
			}
			return acc
		},
		[]
	)

	state.coins = uniqueCoins
		.slice()
		.sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))
		.slice(0, MAX_COINS)
}
```

### 3. Предотвращение повторной обработки данных

**useSignalInitializer:**

```typescript
// Track processed data to prevent duplicates
const processedDataRef = useRef<Set<string>>(new Set())

// Helper function to create a unique key for data
const createDataKey = (data: any, type: string) => {
	if (!data) return null
	const dataString = JSON.stringify(data)
	return `${type}-${dataString}`
}

// Check if data was already processed
const dataKey = createDataKey(topGainersData, 'gainers')
if (dataKey && !processedDataRef.current.has(dataKey)) {
	// Process data only once
	dispatch(replaceTimeframeGainers({ data: coins }))
	processedDataRef.current.add(dataKey)
}
```

### 4. Улучшенное логирование для отладки

**Добавлено в таблицы:**

```typescript
// Debug logging to track data and detect duplicates
useEffect(() => {
	if (coins.length > 0) {
		const symbols = coins.map(coin => coin.symbol)
		const uniqueSymbols = new Set(symbols)
		if (symbols.length !== uniqueSymbols.size) {
			console.warn(`⚠️ Duplicate symbols detected in ${type}:`, {
				total: symbols.length,
				unique: uniqueSymbols.size,
				duplicates: symbols.filter(
					(symbol, index) => symbols.indexOf(symbol) !== index
				)
			})
		} else {
			console.log(`✅ ${type} table: ${coins.length} unique symbols`)
		}
	}
}, [coins, type])
```

## Результат

После внесения изменений:

1. **Устранено дублирование символов** - каждый символ отображается только один раз
2. **Упрощена архитектура** - единственная точка инициализации данных
3. **Улучшена производительность** - нет повторной обработки одних и тех же данных
4. **Добавлена отладочная информация** - легко отслеживать состояние данных

## Архитектура после исправления

```
Layout (SignalSocketInitializer)
├── useSignalInitializer() - единственная точка инициализации
├── RTK Query хуки с автообновлением
└── Redux store с защитой от дубликатов

SignalTable (только отображение)
├── Чтение данных из Redux store
├── Отображение таблиц
└── Логирование для отладки
```

## Мониторинг

В консоли браузера теперь отображается:

- ✅ Успешная обработка данных без дубликатов
- ⚠️ Предупреждения о дубликатах (если они появятся)
- 📊 Количество уникальных символов в каждой таблице
- 🔄 Процесс обработки новых данных
