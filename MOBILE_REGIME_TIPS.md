# Mobile Regime Tips - Мобильные подсказки по режимам

## Обзор

Полный комплект для отображения мобильных подсказок по торговле в различных режимах рынка:

- ✅ Аккуратные типы
- ✅ Полный набор подсказок (до 10 пунктов в каждой категории)
- ✅ Компактная версия (по 3 пункта)
- ✅ Мини-бейдж "почему" для gate rules
- ✅ Мобильная карточка с аккордеонами

## Структура файлов

```
src/
├── lib/
│   ├── regime-tips.ts           # Типы и полный набор подсказок
│   ├── regime-tips-compact.ts   # Компактная версия (3 пункта)
│   └── why.ts                   # Логика gate rules
├── components/
│   ├── MobileRegimeTipsCard.tsx # Мобильная карточка с аккордеонами
│   ├── WhyGateBadgeMini.tsx     # Мини-бейдж "почему"
│   └── regime-tips/             # Десктопные компоненты
│       ├── RegimeTipsCard.tsx
│       └── WhyGateBadge.tsx
```

## Типы

### Режимы рынка (Regime)

```typescript
type Regime =
	| 'range' // Боковик/диапазон
	| 'squeeze' // Сжатие
	| 'trending_bull' // Бычий тренд
	| 'trending_bear' // Медвежий тренд
	| 'expansion' // Расширение/price discovery
```

### Типы сигналов (SignalType)

```typescript
type SignalType =
	| 'fvg' // Fair Value Gap
	| 'ob' // Order Block
	| 'breaker' // Breaker Block
	| 'volumeSpike' // Volume Spike
	| 'volatility' // Volatility Signal
	| 'smt' // Smart Money Tool
	| 'other' // Другие сигналы
```

## Компоненты

### 1. MobileRegimeTipsCard

Мобильная карточка с подсказками, использует аккордеоны для экономии места.

**Пропсы:**

- `regime: Regime` - текущий режим рынка

**Особенности:**

- 📱 Оптимизирована для мобильных устройств
- 🎯 Компактный дизайн (по 3 пункта в каждой секции)
- 🔄 Аккордеоны для навигации
- 🎨 Цветовая индикация по режиму

**Пример использования:**

```tsx
import { MobileRegimeTipsCard } from '@/components/MobileRegimeTipsCard'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'

function MyComponent() {
	const { regime: live } = useRegimeSocket()
	const regime = (live?.regime ?? 'range') as Regime

	return <MobileRegimeTipsCard regime={regime} />
}
```

### 2. WhyGateBadgeMini

Компактный бейдж показывающий разрешён ли сигнал в текущем режиме.

**Пропсы:**

- `regime: Regime` - текущий режим рынка
- `type: SignalType` - тип сигнала
- `side?: 'long' | 'short'` - направление сделки (опционально)

**Особенности:**

- ✅ Показывает статус: OK / NO
- 💡 Краткое объяснение причины
- 🎨 Цветовая индикация (зелёный/красный)
- 📱 Компактный размер

**Пример использования:**

```tsx
import { WhyGateBadgeMini } from '@/components/WhyGateBadgeMini'

function SignalCard({ signal }) {
	return (
		<div>
			<h3>{signal.name}</h3>
			<WhyGateBadgeMini
				regime='trending_bull'
				type='fvg'
				side='long'
			/>
		</div>
	)
}
```

### 3. Десктопные компоненты

Для десктопа используйте:

- `RegimeTipsCard` - полная карточка со всеми подсказками
- `WhyGateBadge` - расширенный бейдж с тултипами

```tsx
import { RegimeTipsCard, WhyGateBadge } from '@/components/regime-tips'

<RegimeTipsCard regime="range" />
<WhyGateBadge regime="range" type="fvg" showTooltip={true} />
```

## API

### REGIME_TIPS

Полный набор подсказок (все пункты):

```typescript
import { REGIME_TIPS, Regime } from '@/lib/regime-tips'

const tips = REGIME_TIPS['range']
console.log(tips.do) // ["Играть возвраты к Equilibrium...", ...]
console.log(tips.avoid) // ["Пробойные стратегии...", ...]
console.log(tips.entries) // ["Fade ложных пробоев...", ...]
console.log(tips.gateRules) // [{ allow: false, types: [...], reason: "..." }]
```

### REGIME_TIPS_COMPACT

Компактная версия (по 3 пункта):

```typescript
import { REGIME_TIPS_COMPACT } from '@/lib/regime-tips-compact'

const tips = REGIME_TIPS_COMPACT['range']
console.log(tips.do.length) // 3 (вместо полного списка)
```

### why()

Функция для проверки gate rules:

```typescript
import { why } from '@/lib/why'

const result = why('trending_bull', 'fvg', 'short')
console.log(result.allowed) // false
console.log(result.reason) // "Контртренд в бычьем тренде запрещён (+DI/ADX против)"
```

### compactTips()

Функция для создания компактной версии подсказок:

```typescript
import { REGIME_TIPS, compactTips } from '@/lib/regime-tips-compact'

const fullTips = REGIME_TIPS['range']
const compact = compactTips(fullTips, 3) // оставить только 3 пункта в каждой секции
```

## Полный пример

```tsx
'use client'

import React from 'react'

import { MobileRegimeTipsCard } from '@/components/MobileRegimeTipsCard'
import { WhyGateBadgeMini } from '@/components/WhyGateBadgeMini'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'

import { Regime } from '@/lib/regime-tips'

export default function MobilePanel() {
	const { regime: live } = useRegimeSocket()
	const regime = (live?.regime ?? 'range') as Regime

	// Пример сигнала
	const signal = {
		type: 'fvg' as const,
		side: 'long' as const,
		name: 'BTCUSDT FVG'
	}

	return (
		<div style={{ padding: 12, display: 'grid', gap: 12 }}>
			{/* Карточка с подсказками */}
			<MobileRegimeTipsCard regime={regime} />

			{/* Статус сигнала */}
			<div>
				<div style={{ marginBottom: 6, fontSize: 12, opacity: 0.7 }}>
					Текущий сигнал:
				</div>
				<WhyGateBadgeMini
					regime={regime}
					type={signal.type}
					side={signal.side}
				/>
			</div>
		</div>
	)
}
```

## Цветовая схема

Цвета по режимам:

| Режим         | Цвет    | HEX       |
| ------------- | ------- | --------- |
| Range         | Серый   | `#6b7280` |
| Squeeze       | Жёлтый  | `#eab308` |
| Trending Bull | Зелёный | `#22c55e` |
| Trending Bear | Красный | `#ef4444` |
| Expansion     | Синий   | `#3b82f6` |

Цвета для gate status:

| Статус       | Цвет    | HEX       |
| ------------ | ------- | --------- |
| Allowed (OK) | Зелёный | `#22c55e` |
| Blocked (NO) | Красный | `#ef4444` |

## Секции подсказок

Каждый режим содержит следующие секции (в порядке отображения в аккордеоне):

1. **✅ Делать** (`do`) - Основные действия в режиме
2. **🎯 Входы** (`entries`) - Типовые точки входа
3. **🧾 Чек-лист** (`checklist`) - Быстрая проверка перед входом
4. **🔎 Подтверждения** (`confirmations`) - Что подтверждает сетап
5. **📤 Выходы** (`exits`) - Где фиксировать прибыль
6. **🛡 Риск** (`risk`) - Управление риском
7. **⛔ Избегать** (`avoid`) - Что НЕ делать
8. **❌ Инвалидация** (`invalidation`) - Когда идея сломана
9. **🔁 Смена режима** (`transitions`) - Признаки перехода

## Gate Rules

Gate rules определяют, разрешён ли конкретный тип сигнала в текущем режиме.

**Примеры:**

```typescript
// Range: FVG запрещён (ложные пробои)
why('range', 'fvg')
// → { allowed: false, reason: "Пробойные сетапы в рейндже часто дают фальстарт" }

// Range: SMT разрешён (возврат к средним)
why('range', 'smt')
// → { allowed: true, reason: "SMT-дивергенции хорошо отрабатывают возврат к средним" }

// Trending Bull: FVG Short запрещён (контртренд)
why('trending_bull', 'fvg', 'short')
// → { allowed: false, reason: "Контртренд в бычьем тренде запрещён (+DI/ADX против)" }

// Trending Bull: FVG Long разрешён (по тренду)
why('trending_bull', 'fvg', 'long')
// → { allowed: true, reason: "По-тренду сетапы приоритетны" }
```

## Интеграция с существующими компонентами

### SignalWithGate

Компонент-обёртка для сигналов с автоматической проверкой gate:

```tsx
import { SignalWithGate } from '@/components/signal-with-gate'

;<SignalWithGate
	symbol='BTCUSDT'
	type='fvg'
	side='long'
	compact={false}
	showTooltip={true}
>
	<MySignalCard />
</SignalWithGate>
```

### Страница Regime Tips

Полная страница с подсказками доступна по адресу:
`/i/regime-tips`

Файл: `src/app/i/regime-tips/page.tsx`

## Best Practices

1. **Используйте компактную версию на мобильных устройствах:**

   ```tsx
   const isMobile = useMediaQuery('(max-width: 768px)')
   return isMobile ? <MobileRegimeTipsCard /> : <RegimeTipsCard />
   ```

2. **Всегда передавайте `side` для FVG/OB/Breaker в трендах:**

   ```tsx
   <WhyGateBadgeMini
   	regime='trending_bull'
   	type='fvg'
   	side='long'
   />
   ```

3. **Обрабатывайте отсутствие данных:**

   ```tsx
   const regime = (live?.regime ?? 'range') as Regime
   ```

4. **Используйте gate rules перед открытием сделки:**
   ```tsx
   const { allowed, reason } = why(currentRegime, signalType, side)
   if (!allowed) {
     console.warn(`Сигнал заблокирован: ${reason}`)
     return
   }
   ```

## Troubleshooting

### Ошибка: "Module not found: Can't resolve '@/lib/regime-tips'"

Убедитесь, что все файлы созданы:

- `src/lib/regime-tips.ts`
- `src/lib/regime-tips-compact.ts`
- `src/lib/why.ts`

### Ошибка: Type mismatch для Regime

Убедитесь, что используете тип `Regime` из `@/lib/regime-tips`, а не `RegimeType` из `@/types/signal.types` (они совместимы, но лучше использовать новый).

### Компонент не отображается

Проверьте:

1. Передан ли корректный `regime`
2. Есть ли данные в `REGIME_TIPS[regime]`
3. Нет ли ошибок в консоли браузера

## Changelog

### v1.0.0 (Текущая версия)

- ✅ Полный набор подсказок для всех режимов
- ✅ Компактная версия (3 пункта)
- ✅ Мобильная карточка с аккордеонами
- ✅ Мини-бейдж "почему"
- ✅ Gate rules с учётом направления
- ✅ Десктопные компоненты
- ✅ Полная типизация TypeScript
