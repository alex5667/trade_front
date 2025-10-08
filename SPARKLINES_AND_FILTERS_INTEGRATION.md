# Sparklines & Signal Filters Integration

## 📋 Обзор

Интеграция мини-графов (спарклайнов) для визуализации ADX/ATR% и системы фильтрации сигналов по рыночному режиму.

## 🎯 Что было реализовано

### 1. **API Клиент** (`/src/services/regime.api.ts`)

Методы для работы с Regime endpoints:
- `fetchRegimeLatest()` - последний снапшот режима
- `fetchRegimeRange()` - временной ряд для графиков
- `fetchRegimeQuantiles()` - квантили ADX/ATR%
- `fetchRegimeHistory()` - история за период

### 2. **Компонент Sparkline** (`/src/components/sparkline/`)

Легкий SVG-компонент для мини-графов:
- Две линии: ADX и ATR%
- Автоматическое масштабирование
- Кастомизируемые цвета
- Accessibility support

### 3. **Обновленный RegimeBadge** 

Теперь с поддержкой спарклайнов:
- Опциональное отображение графиков
- Grid layout для бейджа + график
- Синхронизация цветов с режимом

### 4. **Обновленный RegimeWidget**

Полная интеграция с API:
- Загрузка исторических данных
- Live обновления через WebSocket
- Настраиваемое количество точек для графика
- Обработка loading/error состояний

### 5. **Система фильтрации сигналов** (`/src/utils/regime-gate.ts`)

Умная фильтрация по режиму:
- `allowSignal()` - проверка допустимости сигнала
- `filterSignalsByRegime()` - фильтрация массива
- `getFilterReason()` - причина фильтрации
- `getFilterStats()` - статистика фильтрации

### 6. **Хук useFilteredSignals** (`/src/hooks/useFilteredSignals.ts`)

React хук для фильтрации:
- Автоматическая фильтрация по режиму
- Статистика в реальном времени
- Опциональное включение/выключение

### 7. **Компонент SignalsList** (`/src/components/signals-list/`)

Список сигналов с фильтрацией:
- Визуальная индикация отфильтрованных сигналов
- Статистика фильтрации
- Отображение причин фильтрации

### 8. **Обновленные TypeScript типы**

Новые интерфейсы:
- `RegimeSnapshot` - снапшот от API
- `RegimeSnapshotParams` - параметры запроса
- `RegimeQuantiles` - квантили
- `RegimeSeries` - серии для графиков
- `SignalTypeFilter` - типы сигналов
- `FilterableSignal` - фильтруемый сигнал

## 📁 Структура файлов

```
src/
├── services/
│   └── regime.api.ts                       ✅ НОВЫЙ - API клиент
├── components/
│   ├── sparkline/
│   │   ├── Sparkline.tsx                   ✅ НОВЫЙ - SVG спарклайн
│   │   └── index.ts                        ✅ НОВЫЙ
│   ├── regime-badge/
│   │   ├── RegimeBadge.tsx                 ✅ ОБНОВЛЕНО - с графиками
│   │   ├── RegimeBadge.module.scss         ✅ ОБНОВЛЕНО
│   │   ├── RegimeWidget.tsx                ✅ ОБНОВЛЕНО - с API
│   │   └── RegimeWidget.module.scss        ✅ ОБНОВЛЕНО
│   └── signals-list/
│       ├── SignalsList.tsx                 ✅ НОВЫЙ - список сигналов
│       ├── SignalsList.module.scss         ✅ НОВЫЙ
│       ├── SignalsListExample.tsx          ✅ НОВЫЙ - примеры
│       └── index.ts                        ✅ НОВЫЙ
├── hooks/
│   ├── useFilteredSignals.ts               ✅ НОВЫЙ - фильтрация
│   └── useRegimeSocket.ts                  ✅ ОБНОВЛЕНО
├── utils/
│   └── regime-gate.ts                      ✅ НОВЫЙ - логика фильтрации
├── types/
│   └── signal.types.ts                     ✅ ОБНОВЛЕНО - новые типы
└── app/i/
    └── UserBoardPage.tsx                   ✅ ОБНОВЛЕНО - демо
```

## 🚀 Использование

### RegimeWidget с спарклайнами

```tsx
import { RegimeWidget } from '@/components/regime-badge'

<RegimeWidget 
  symbol="BTCUSDT" 
  timeframe="1m"
  showStatus={true}
  showSparkline={true}
  sparklinePoints={100}
  autoUpdate={true}
/>
```

### SignalsList с фильтрацией

```tsx
import { SignalsList } from '@/components/signals-list'
import { FilterableSignal } from '@/types/signal.types'

const signals: FilterableSignal[] = [
  { type: 'fvg', side: 'long', symbol: 'BTCUSDT' },
  { type: 'ob', side: 'short', symbol: 'ETHUSDT' },
]

<SignalsList 
  signals={signals} 
  enableFiltering={true}
  showFiltered={false}
/>
```

### Использование хука напрямую

```tsx
import { useFilteredSignals } from '@/hooks/useFilteredSignals'
import { useRegimeSocket } from '@/hooks/useRegimeSocket'

const { regime } = useRegimeSocket()
const { filtered, stats, isFiltering } = useFilteredSignals(
  allSignals,
  regime?.regime,
  { enabled: true }
)

console.log(`Filtered ${stats.filtered} of ${stats.total} signals`)
```

### API методы

```tsx
import { 
  fetchRegimeLatest, 
  fetchRegimeRange, 
  fetchRegimeQuantiles 
} from '@/services/regime.api'

// Последний снапшот
const latest = await fetchRegimeLatest('BTCUSDT', '1m')

// Временной ряд для графика
const series = await fetchRegimeRange({
  symbol: 'BTCUSDT',
  timeframe: '5m',
  limit: 300
})

// Квантили
const quantiles = await fetchRegimeQuantiles('BTCUSDT', '1m')
```

## 🎨 Логика фильтрации по режиму

### Trending Bull
- ✅ Лонговые FVG, OB, Breaker
- ❌ Шортовые FVG, OB, Breaker (контртренд)
- ✅ Все остальные сигналы

### Trending Bear
- ✅ Шортовые FVG, OB, Breaker
- ❌ Лонговые FVG, OB, Breaker (контртренд)
- ✅ Все остальные сигналы

### Squeeze
- ✅ Volume Spike, Volatility
- ❌ Все остальные (пробои ненадежны)

### Range
- ✅ SMT (mean-reversion)
- ❌ FVG, OB (пробои часто ложные)
- ✅ Остальные сигналы

### Expansion
- ✅ Все сигналы допускаются

## 📊 Props компонентов

### RegimeWidget

```typescript
interface RegimeWidgetProps {
  symbol: string                    // Торговая пара
  timeframe: string                 // Таймфрейм
  className?: string                // CSS класс
  showStatus?: boolean              // Показать статус (default: true)
  showSparkline?: boolean           // Показать график (default: true)
  sparklinePoints?: number          // Точек на графике (default: 300)
  autoUpdate?: boolean              // Auto WebSocket (default: true)
}
```

### Sparkline

```typescript
interface SparklineProps {
  width?: number                    // Ширина (default: 240)
  height?: number                   // Высота (default: 54)
  adx?: number[]                    // ADX данные
  atrPct?: number[]                 // ATR% данные
  adxMin?: number                   // Min для ADX
  adxMax?: number                   // Max для ADX
  atrMin?: number                   // Min для ATR%
  atrMax?: number                   // Max для ATR%
  className?: string                // CSS класс
  adxColor?: string                 // Цвет ADX линии
  atrColor?: string                 // Цвет ATR% линии
}
```

### SignalsList

```typescript
interface SignalsListProps {
  signals: FilterableSignal[]       // Массив сигналов
  showFiltered?: boolean            // Показать отфильтрованные (default: false)
  enableFiltering?: boolean         // Включить фильтрацию (default: true)
}
```

## 🔧 Конфигурация Backend

### WebSocket событие 'regime'

```json
{
  "symbol": "BTCUSDT",
  "timeframe": "1m",
  "regime": "trending_bull",
  "adx": 28.5,
  "atrPct": 0.0234,
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

### API Endpoints

1. **GET /regime/snapshot/latest**
   - Params: `symbol`, `timeframe`
   - Returns: `RegimeSnapshot`

2. **GET /regime/snapshot/range**
   - Params: `symbol`, `timeframe`, `from?`, `to?`, `limit?`
   - Returns: `RegimeSnapshot[]`

3. **GET /regime/quantiles**
   - Params: `symbol`, `timeframe`
   - Returns: `RegimeQuantiles`

## 🧪 Тестирование

### Проверка спарклайнов

```tsx
// В UserBoardPage уже добавлен пример
// Открой /i в браузере и увидишь виджет с графиком
```

### Проверка фильтрации

```tsx
import { allowSignal } from '@/utils/regime-gate'

// Тест 1: Long FVG в бычьем тренде ✅
console.log(allowSignal('trending_bull', { type: 'fvg', side: 'long' })) // true

// Тест 2: Short FVG в бычьем тренде ❌
console.log(allowSignal('trending_bull', { type: 'fvg', side: 'short' })) // false

// Тест 3: FVG в squeeze ❌
console.log(allowSignal('squeeze', { type: 'fvg' })) // false

// Тест 4: Volume spike в squeeze ✅
console.log(allowSignal('squeeze', { type: 'volumeSpike' })) // true
```

### Smoke Test

1. Запустите backend (regime-worker, regime-quantiles)
2. Откройте `http://localhost:3000/i`
3. Проверьте:
   - ✅ RegimeWidget отображается
   - ✅ Спарклайны рендерятся
   - ✅ WebSocket подключается (зеленая точка)
   - ✅ SignalsList показывает отфильтрованные сигналы
   - ✅ Статистика фильтрации отображается

## 📝 Переменные окружения

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4202
```

## 🎯 Следующие шаги

1. **Backend Setup**
   - Настройте endpoints для regime API
   - Добавьте WebSocket событие 'regime' с symbol/timeframe

2. **Интеграция с реальными данными**
   - Замените mock данные на Redux селекторы
   - Подключите к реальному WebSocket

3. **Расширение функционала**
   - Добавьте больше типов сигналов
   - Настройте кастомные правила фильтрации
   - Добавьте историю режимов

4. **UI Improvements**
   - Добавьте анимации при фильтрации
   - Создайте tooltip с деталями режима
   - Добавьте экспорт статистики

## 📚 Связанные документы

- [Market Regime Integration](/MARKET_REGIME_INTEGRATION.md)
- [Backend Example](/REGIME_BACKEND_EXAMPLE.md)
- [Компонент RegimeBadge](/src/components/regime-badge/README.md)
- [Примеры SignalsList](/src/components/signals-list/SignalsListExample.tsx)

## ✅ Checklist

- [x] API клиент создан
- [x] Sparkline компонент реализован
- [x] RegimeBadge обновлен с графиками
- [x] RegimeWidget загружает данные из API
- [x] Система фильтрации реализована
- [x] useFilteredSignals хук создан
- [x] SignalsList компонент готов
- [x] Примеры использования добавлены
- [x] TypeScript типы обновлены
- [x] UserBoardPage интегрирован
- [x] Документация написана
- [ ] Backend endpoints настроены
- [ ] WebSocket события настроены
- [ ] Production тестирование

## 🚦 Статус

**✅ Готово к использованию (Frontend)**  
**⏳ Требуется настройка Backend**

---

*Версия: 1.0.0 | Дата: 2025-10-08*

