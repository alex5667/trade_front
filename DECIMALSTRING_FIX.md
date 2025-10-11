# DecimalString TypeError Fix

## 🐛 Проблема

При работе с сигналами возникали ошибки типа:

```
Error: signal.volatility.toFixed is not a function
```

## 🔍 Причина

Поля, определенные как `DecimalString` в типах (например, `volatility`, `range`, `price`), приходят с backend как **строки**, а не как числа. Попытка вызвать методы числа (`.toFixed()`) на строках приводит к ошибке.

```typescript
// В types/signal.types.ts
export type DecimalString = string

export interface VolatilityRangeSignal {
	volatility: DecimalString // ← Это СТРОКА!
	range?: DecimalString
	avgRange?: DecimalString
}
```

## ✅ Решение

Конвертировать `DecimalString` в число перед использованием методов числа:

### До (неправильно)

```tsx
{
	signal.volatility.toFixed(4)
} // ❌ Error!
```

### После (правильно)

```tsx
{
	Number(signal.volatility).toFixed(4)
} // ✅ OK!
```

## 🔧 Исправленные файлы

### 1. VolatilitySpikeComponent.tsx

```tsx
// Строка 269
{
	signal.volatility !== undefined
		? Number(signal.volatility).toFixed(4) // ✅ Добавлен Number()
		: '0.0000'
}

// Строка 277-279
{
	signal.volatilityChange !== undefined
		? (Number(signal.volatilityChange) > 0 ? '+' : '') +
			Number(signal.volatilityChange).toFixed(2)
		: '-'
}

// Функция renderPriceChange (строка 227-228)
const openNum = Number(signal.open)
const closeNum = Number(signal.close)
const diff = closeNum - openNum
const percent = openNum !== 0 ? (diff / openNum) * 100 : 0
```

### 2. VolatilitySignalComponent.tsx

```tsx
// Строка 143
{signal.volatility !== undefined
  ? Number(signal.volatility).toFixed(4)
  : '0.0000'}

// Строка 147-154
className={`${s.cell} ${signal.volatilityChange !== undefined && Number(signal.volatilityChange) > 0 ? s.positive : s.negative}`}
{Number(signal.volatilityChange).toFixed(2)}
```

### 3. VolatilityRangeComponent.tsx

```tsx
// Строка 214 (в функции renderPercentChange)
change = Number(signal.volatilityChange)

// Строка 220-225 (вычисление change)
const rangeNum = Number(signal.range)
const avgRangeNum = Number(signal.avgRange)
change = ((rangeNum - avgRangeNum) / avgRangeNum) * 100

// Строка 278
? `${Number(signal.volatility).toFixed(2)}%`

// Строка 284
{signal.range !== undefined ? Number(signal.range).toFixed(6) : '-'}

// Строка 290
? Number(signal.avgRange).toFixed(6)

// Строка 297
? `${Number(signal.volatilityChange) > 0 ? '+' : ''}${Number(signal.volatilityChange).toFixed(2)}%`
```

### 4. TimeframeCoinsTable.tsx

```tsx
// Строка 32
{
	typeof coin.percentChange === 'number'
		? `${Number(coin.percentChange).toFixed(2)}%`
		: coin.percentChange !== undefined
			? `${Number(coin.percentChange).toFixed(2)}%`
			: '-'
}
```

### 5. FundingTable.tsx

```tsx
// Строка 47
return `${(Number(rate) * 100).toFixed(3)}%`
```

## 🛠️ Утилита formatDecimal.ts

Создана утилита для безопасной работы с `DecimalString`:

```typescript
import { formatDecimal, formatPercent, toNumber } from '@/utils/formatDecimal'

// Безопасная конвертация
const num = toNumber(signal.volatility, 0)

// Форматирование
const formatted = formatDecimal(signal.volatility, 4, '-')

// Процент
const percent = formatPercent(signal.atrPct, 2, '-')

// Изменение цены
const change = calculatePercentChange(signal.open, signal.close, 2)
```

## 📋 Использование утилиты

### Пример 1: Простое форматирование

```tsx
import { formatDecimal } from '@/utils/formatDecimal'

;<td>{formatDecimal(signal.volatility, 4)}</td>
```

### Пример 2: Процентное значение

```tsx
import { formatPercent } from '@/utils/formatDecimal'

;<td>{formatPercent(signal.atrPct, 2)}</td>
```

### Пример 3: Изменение цены

```tsx
import { calculatePercentChange } from '@/utils/formatDecimal'

;<td>{calculatePercentChange(signal.open, signal.close, 2)}</td>
```

## ✅ Checklist проверки

При работе с числовыми полями из API всегда:

- [x] Используйте `Number()` перед `.toFixed()`
- [x] Используйте `Number()` перед арифметическими операциями
- [x] Используйте `Number()` перед сравнениями (>, <, ===)
- [x] Или используйте утилиты из `formatDecimal.ts`

## 🎯 Правило для будущего

**Всегда конвертируйте `DecimalString` в число перед использованием:**

```typescript
// ❌ НЕПРАВИЛЬНО
signal.volatility.toFixed(4)
signal.price > 100
signal.volume + signal.quoteVolume

// ✅ ПРАВИЛЬНО
Number(signal.volatility).toFixed(4)
Number(signal.price) > 100
Number(signal.volume) + Number(signal.quoteVolume)

// ✅ ЕЩЕ ЛУЧШЕ (с утилитой)
formatDecimal(signal.volatility, 4)
toNumber(signal.price) > 100
toNumber(signal.volume) + toNumber(signal.quoteVolume)
```

## 📝 Типы, требующие конвертации

Все поля с типом `DecimalString` или `BigIntString`:

- `volatility`
- `range`, `avgRange`
- `price`, `open`, `high`, `low`, `close`
- `volume`, `quoteVolume`
- `change`, `volatilityChange`
- `rate` (в funding)
- И другие числовые поля из API

---

**Статус**: ✅ Исправлено  
**Дата**: 2025-10-08  
**Затронуто файлов**: 5
