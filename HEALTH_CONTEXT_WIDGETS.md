# Health & Context Widgets Integration

## 📋 Обзор

Интеграция виджетов для мониторинга здоровья пайплайна (RegimeHealth) и HTF контекста (RegimeContext) с расширенным API клиентом.

## 🎯 Что было реализовано

### 1. **Расширенный API клиент** (`/src/services/regime.api.ts`)

Добавлены новые методы:

#### `fetchRegimeHealth(symbol, timeframe, maxLagSec)`

Получает статус здоровья пайплайна для символа/таймфрейма:

- Проверка задержки последнего снапшота
- Наличие квантилей
- Количество семплов за 1ч и 1д

#### `fetchRegimeAggHourly(symbol, timeframe, hours)`

Агрегированные данные по часам:

- Распределение режимов
- Средние ADX и ATR%

#### `fetchRegimeAggDaily(symbol, timeframe, days)`

Агрегированные данные по дням

#### `fetchRegimeContext(params)`

HTF контекст и проверка допуска сигнала:

- LTF режим
- HTF режим
- Допустимость сигнала
- Bias направления

### 2. **RegimeHealth компонент** (`/src/components/regime-health/`)

Виджет мониторинга здоровья пайплайна:

- Визуальная индикация статуса (ok/warn/error)
- Задержка последнего снапшота
- Статистика семплов
- Автообновление каждые 15 секунд

### 3. **RegimeContext компонент** (`/src/components/regime-context/`)

Виджет HTF контекста:

- Режим на LTF таймфрейме
- Режим на HTF таймфрейме
- Проверка допуска сигнала
- Bias направления
- Автообновление

### 4. **Regime Dashboard страница** (`/src/app/i/regime-dashboard/`)

Полноценный дашборд:

- RegimeWidget с графиками
- RegimeHealth мониторинг
- RegimeContext анализ
- Информационная панель с типами режимов

### 5. **Обновленные TypeScript типы**

Новые интерфейсы:

- `HealthStatus` - статусы здоровья
- `RegimeHealthResponse` - ответ health endpoint
- `RegimeAggHourly/Daily` - агрегация
- `RegimeContextResponse` - контекст LTF/HTF

## 📁 Структура файлов

```
src/
├── services/
│   └── regime.api.ts                       ✅ ОБНОВЛЕНО - новые методы
├── components/
│   ├── regime-health/
│   │   ├── RegimeHealth.tsx                ✅ НОВЫЙ
│   │   ├── RegimeHealth.module.scss        ✅ НОВЫЙ
│   │   └── index.ts                        ✅ НОВЫЙ
│   └── regime-context/
│       ├── RegimeContext.tsx               ✅ НОВЫЙ
│       ├── RegimeContext.module.scss       ✅ НОВЫЙ
│       └── index.ts                        ✅ НОВЫЙ
├── types/
│   └── signal.types.ts                     ✅ ОБНОВЛЕНО - новые типы
├── app/i/
│   ├── regime-dashboard/
│   │   ├── page.tsx                        ✅ НОВЫЙ - демо страница
│   │   └── RegimeDashboard.module.scss     ✅ НОВЫЙ
│   └── UserBoardPage.tsx                   ✅ ОБНОВЛЕНО - добавлен Health
```

## 🚀 Использование

### RegimeHealth

```tsx
import { RegimeHealth } from '@/components/regime-health'

;<RegimeHealth
	symbol='BTCUSDT'
	timeframe='1m'
	maxLagSec={180}
	refreshInterval={15000}
/>
```

**Props:**

- `symbol` - торговая пара (обязательный)
- `timeframe` - таймфрейм (обязательный)
- `maxLagSec` - макс. задержка в секундах (default: 180)
- `refreshInterval` - интервал обновления в мс (default: 15000)
- `className` - CSS класс

### RegimeContext

```tsx
import { RegimeContext } from '@/components/regime-context'

;<RegimeContext
	symbol='BTCUSDT'
	ltf='1m'
	htf='1h'
	signalType='fvg'
	side='long'
	refreshInterval={15000}
/>
```

**Props:**

- `symbol` - торговая пара (обязательный)
- `ltf` - Lower TimeFrame (обязательный)
- `htf` - Higher TimeFrame (обязательный)
- `signalType` - тип сигнала (опционально)
- `side` - сторона: 'long' | 'short' (опционально)
- `refreshInterval` - интервал обновления в мс (default: 15000)
- `className` - CSS класс

### API методы

```tsx
import {
	fetchRegimeAggDaily,
	fetchRegimeAggHourly,
	fetchRegimeContext,
	fetchRegimeHealth
} from '@/services/regime.api'

// Health check
const health = await fetchRegimeHealth('BTCUSDT', '1m', 180)
console.log(health.status) // 'ok' | 'warn' | 'error'

// HTF context
const context = await fetchRegimeContext({
	symbol: 'BTCUSDT',
	ltf: '1m',
	htf: '1h',
	signalType: 'fvg',
	side: 'long'
})
console.log(context.allowed) // true | false

// Hourly aggregation
const hourly = await fetchRegimeAggHourly('BTCUSDT', '1m', 24)

// Daily aggregation
const daily = await fetchRegimeAggDaily('BTCUSDT', '1m', 14)
```

## 📊 API Response примеры

### Health Response

```json
{
	"symbol": "BTCUSDT",
	"timeframe": "1m",
	"status": "ok",
	"lastSnapshot": {
		"timestamp": "2025-10-08T12:00:00.000Z",
		"lagSec": 5
	},
	"quantilesPresent": true,
	"samples": {
		"last1h": {
			"actual": 60,
			"expected": 60
		},
		"last1d": {
			"actual": 1440,
			"expected": 1440
		}
	}
}
```

### Context Response

```json
{
	"symbol": "BTCUSDT",
	"ltf": "1m",
	"htf": "1h",
	"latestLTF": {
		"regime": "trending_bull",
		"adx": 28.5,
		"atrPct": 0.0234,
		"timestamp": "2025-10-08T12:00:00.000Z"
	},
	"latestHTF": {
		"regime": "trending_bull",
		"adx": 32.1,
		"atrPct": 0.0289,
		"timestamp": "2025-10-08T12:00:00.000Z"
	},
	"allowed": true,
	"bias": "bullish",
	"signalType": "fvg",
	"side": "long"
}
```

## 🎨 Визуальная индикация

### Health Status

| Статус  | Цвет       | Значение       |
| ------- | ---------- | -------------- |
| `ok`    | 🟢 Зеленый | Все в порядке  |
| `warn`  | 🟡 Желтый  | Предупреждение |
| `error` | 🔴 Красный | Ошибка         |

### Regime Colors

| Режим         | Цвет    | HEX       |
| ------------- | ------- | --------- |
| Range         | Серый   | `#6b7280` |
| Squeeze       | Желтый  | `#eab308` |
| Trending Bull | Зеленый | `#22c55e` |
| Trending Bear | Красный | `#ef4444` |
| Expansion     | Синий   | `#3b82f6` |

## 🔧 Backend Requirements

### Endpoints

1. **GET /regime/health**

   ```
   Query params:
   - symbol: string
   - timeframe: string
   - maxLagSec: number (default: 180)

   Returns: RegimeHealthResponse
   ```

2. **GET /regime/context**

   ```
   Query params:
   - symbol: string
   - ltf: string
   - htf: string
   - signalType?: string
   - side?: 'long' | 'short'

   Returns: RegimeContextResponse
   ```

3. **GET /regime/agg/hourly**

   ```
   Query params:
   - symbol: string
   - timeframe: string
   - hours: number (default: 24)

   Returns: RegimeAggHourly[]
   ```

4. **GET /regime/agg/daily**

   ```
   Query params:
   - symbol: string
   - timeframe: string
   - days: number (default: 14)

   Returns: RegimeAggDaily[]
   ```

## 📱 Страницы

### User Dashboard (`/i`)

- RegimeWidget с спарклайнами
- RegimeHealth виджет
- SignalsList с фильтрацией
- Кнопка перехода на Advanced Dashboard

### Regime Dashboard (`/i/regime-dashboard`)

- Полный RegimeWidget
- RegimeHealth мониторинг
- RegimeContext анализ
- Информационная панель с типами режимов

## 🧪 Тестирование

### 1. Health Widget

```bash
# Проверьте endpoint
curl "http://localhost:4207/api/regime/health?symbol=BTCUSDT&timeframe=1m&maxLagSec=180"

# Откройте страницу
http://localhost:3000/i
```

Ожидается:

- ✅ Статус отображается с цветом
- ✅ Задержка показывается в секундах
- ✅ Количество семплов корректное
- ✅ Автообновление каждые 15 сек

### 2. Context Widget

```bash
# Проверьте endpoint
curl "http://localhost:4207/api/regime/context?symbol=BTCUSDT&ltf=1m&htf=1h&signalType=fvg&side=long"

# Откройте страницу
http://localhost:3000/i/regime-dashboard
```

Ожидается:

- ✅ LTF и HTF режимы отображаются
- ✅ Цвета соответствуют режимам
- ✅ ALLOWED/BLOCKED корректно
- ✅ Bias отображается

## 🎯 Примеры использования

### Пример 1: Базовая интеграция

```tsx
import { RegimeContext } from '@/components/regime-context'
import { RegimeHealth } from '@/components/regime-health'

export default function TradingPage() {
	return (
		<div className='space-y-4'>
			<RegimeHealth
				symbol='BTCUSDT'
				timeframe='1m'
			/>
			<RegimeContext
				symbol='BTCUSDT'
				ltf='1m'
				htf='1h'
			/>
		</div>
	)
}
```

### Пример 2: С проверкой сигнала

```tsx
export default function SignalValidator() {
	return (
		<RegimeContext
			symbol='BTCUSDT'
			ltf='5m'
			htf='1h'
			signalType='fvg'
			side='long'
		/>
	)
}
```

### Пример 3: Мультисимвольный мониторинг

```tsx
const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']

export default function MultiSymbolHealth() {
	return (
		<div className='grid grid-cols-3 gap-4'>
			{symbols.map(symbol => (
				<RegimeHealth
					key={symbol}
					symbol={symbol}
					timeframe='1m'
				/>
			))}
		</div>
	)
}
```

## 📝 Переменные окружения

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
```

## ✅ Checklist интеграции

### Frontend

- [x] API клиент расширен
- [x] RegimeHealth компонент создан
- [x] RegimeContext компонент создан
- [x] Стили SCSS созданы
- [x] TypeScript типы обновлены
- [x] Regime Dashboard страница создана
- [x] UserBoardPage обновлен
- [x] Документация написана
- [x] Linter проверен

### Backend (требуется)

- [ ] Endpoint `/regime/health` реализован
- [ ] Endpoint `/regime/context` реализован
- [ ] Endpoint `/regime/agg/hourly` реализован
- [ ] Endpoint `/regime/agg/daily` реализован
- [ ] Тестирование endpoints

## 🚦 Следующие шаги

1. **Настройте Backend endpoints**

   - Реализуйте `/regime/health`
   - Реализуйте `/regime/context`
   - Добавьте агрегационные endpoints

2. **Тестирование**

   - Проверьте работу Health виджета
   - Проверьте Context с разными сигналами
   - Проверьте автообновление

3. **Расширение функционала**
   - Добавьте историю health статусов
   - Создайте алерты при warn/error
   - Добавьте экспорт данных

## 📚 Связанные документы

- [Sparklines & Filters Integration](/SPARKLINES_AND_FILTERS_INTEGRATION.md)
- [Market Regime Integration](/MARKET_REGIME_INTEGRATION.md)
- [Backend Example](/REGIME_BACKEND_EXAMPLE.md)

## 🎨 UI/UX особенности

- **Auto-refresh**: Виджеты обновляются каждые 15 секунд
- **Color coding**: Интуитивная цветовая индикация статусов
- **Responsive**: Адаптивный дизайн для всех экранов
- **Loading states**: Плавные состояния загрузки
- **Error handling**: Корректная обработка ошибок

---

**Статус**: ✅ Frontend готов | ⏳ Backend требуется  
**Версия**: 1.0.0  
**Дата**: 2025-10-08
