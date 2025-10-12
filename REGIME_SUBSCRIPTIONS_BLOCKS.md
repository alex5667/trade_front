# Regime Subscriptions - Block Architecture

## 🎯 Новая архитектура

Страница `/i/regime-subscriptions` переработана в **блочную систему**, где каждый символ представлен отдельным блоком с полным набором виджетов.

## 📊 Структура страницы

```
┌─────────────────────────────────────────────────────────┐
│ Market Regime Subscriptions                             │
│ Comprehensive market analysis with multi-symbol regime  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🟢 Connected | Active subscriptions: 6                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ➕ Add New Symbol                                       │
│ ┌────────┐ ┌─────┐ ┌─────┐ ┌──────────────┐           │
│ │ Symbol │ │ LTF │ │ HTF │ │ ➕ Add Symbol│           │
│ │[INPUT] │ │ 1m  │ │ 1h  │ └──────────────┘           │
│ └────────┘ └─────┘ └─────┘                             │
│                                                          │
│ Quick add: [ETHUSDT] [BNBUSDT] [SOLUSDT]               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ BTCUSDT                    🗑️ Remove                    │
│ LTF: 1m | HTF: 1h                                      │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│ │Market Regime │ │Regime Health │ │Regime Context│   │
│ │   [Widget]   │ │   [Widget]   │ │   [Widget]   │   │
│ └──────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ETHUSDT                    🗑️ Remove                    │
│ LTF: 15m | HTF: 4h                                     │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│ │Market Regime │ │Regime Health │ │Regime Context│   │
│ │   [Widget]   │ │   [Widget]   │ │   [Widget]   │   │
│ └──────────────┘ └──────────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Компоненты

### 1. Status Bar

Показывает общий статус соединения и количество активных подписок.

```tsx
<div className={styles.statusBar}>
	<span>🟢 Connected</span>
	<span>Active subscriptions: 6</span>
</div>
```

### 2. Add Symbol Panel

Панель для добавления новых символов с настройками таймфреймов.

**Элементы:**

- **Symbol input** - ввод символа (с Enter support)
- **LTF selector** - выбор нижнего таймфрейма
- **HTF selector** - выбор верхнего таймфрейма
- **Add button** - кнопка добавления
- **Quick Add buttons** - быстрое добавление популярных символов

### 3. Symbol Blocks

Каждый символ = отдельный блок с виджетами.

**Структура блока:**

```tsx
<div className={styles.symbolBlock}>
  {/* Header */}
  <div className={styles.symbolBlockHeader}>
    <div className={styles.symbolBlockTitle}>
      <h2>BTCUSDT</h2>
      <span>LTF: 1m | HTF: 1h</span>
    </div>
    <button>🗑️ Remove</button>
  </div>

  {/* Widgets Grid */}
  <div className={styles.symbolBlockContent}>
    <div className={styles.widgetCard}>
      <h3>Market Regime</h3>
      <RegimeWidget ... />
    </div>

    <div className={styles.widgetCard}>
      <h3>Regime Health</h3>
      <RegimeHealth ... />
    </div>

    <div className={styles.widgetCard}>
      <h3>Regime Context</h3>
      <RegimeContext ... />
    </div>
  </div>
</div>
```

## 💾 Data Structure

### SymbolConfig Interface

```typescript
interface SymbolConfig {
	symbol: string // e.g., 'BTCUSDT'
	ltf: string // e.g., '1m'
	htf: string // e.g., '1h'
}
```

### State Management

```typescript
// Массив конфигураций символов
const [symbolConfigs, setSymbolConfigs] = useState<SymbolConfig[]>([
	{ symbol: 'BTCUSDT', ltf: '1m', htf: '1h' }
])

// Настройки по умолчанию для новых символов
const [defaultLtf, setDefaultLtf] = useState('1m')
const [defaultHtf, setDefaultHtf] = useState('1h')
```

## 🔄 Логика работы

### Добавление символа

1. **Валидация:**

   - Проверка на пустоту
   - Проверка на дубликаты
   - Автоматический uppercase

2. **Создание конфигурации:**

```typescript
const newConfig: SymbolConfig = {
	symbol: symbolToAdd,
	ltf: defaultLtf,
	htf: defaultHtf
}
```

3. **Обновление подписки:**

```typescript
// Собираем все символы
const symbols = updatedConfigs.map(config => config.symbol)

// Собираем все уникальные таймфреймы
const allTimeframes = [
	...new Set(updatedConfigs.flatMap(config => [config.ltf, config.htf]))
]

// Обновляем WebSocket подписку
subscribe(symbols, allTimeframes)
```

### Удаление символа

1. **Защита от удаления последнего символа**
2. **Фильтрация массива конфигураций**
3. **Автоматическое обновление WebSocket подписки**

```typescript
const handleRemoveSymbol = (symbolToRemove: string) => {
	if (symbolConfigs.length === 1) {
		alert('⚠️ Нельзя удалить последний символ')
		return
	}

	const updatedConfigs = symbolConfigs.filter(
		config => config.symbol !== symbolToRemove
	)
	setSymbolConfigs(updatedConfigs)

	// Обновляем подписку...
}
```

### Автоматическая подписка

При изменении `symbolConfigs` автоматически обновляется WebSocket подписка:

```typescript
useEffect(() => {
	if (isConnected && symbolConfigs.length > 0) {
		const symbols = symbolConfigs.map(config => config.symbol)
		const allTimeframes = [
			...new Set(symbolConfigs.flatMap(config => [config.ltf, config.htf]))
		]

		console.log('🔄 Auto-subscribing to symbols:', symbols)
		console.log('🔄 Timeframes:', allTimeframes)

		subscribe(symbols, allTimeframes)
	}
}, [isConnected, symbolConfigs, subscribe])
```

## 🎨 Стили

### Responsive Grid для виджетов

```scss
.symbolBlockContent {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: 1fr; // Mobile: 1 колонка

	@media (min-width: 768px) {
		grid-template-columns: repeat(2, 1fr); // Tablet: 2 колонки
	}

	@media (min-width: 1280px) {
		grid-template-columns: repeat(3, 1fr); // Desktop: 3 колонки
	}
}
```

### Hover эффекты

```scss
.symbolBlock {
	transition: all 0.3s;

	&:hover {
		border-color: #3b82f6;
		box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
	}
}
```

### Widget Cards

```scss
.widgetCard {
	background: var(--bg-primary, #111827);
	border: 1px solid var(--border-color, #374151);
	border-radius: 0.75rem;
	padding: 1rem;
	min-height: 200px;
}
```

## 📱 Адаптивность

### Mobile (< 768px)

- **1 виджет** в ряду
- **Вертикальный** стек блоков
- **Full-width** controls

### Tablet (768px - 1279px)

- **2 виджета** в ряду
- **Компактный** header
- **Flex-wrap** controls

### Desktop (≥ 1280px)

- **3 виджета** в ряду
- **Просторный** layout
- **Inline** controls

## 🚀 Workflow

### Сценарий 1: Добавление нового символа

1. Пользователь вводит "ETHUSDT"
2. Выбирает LTF: "15m", HTF: "4h"
3. Нажимает "➕ Add Symbol"
4. ✅ Создается новый блок с ETHUSDT
5. ✅ Автоматически подписывается на ETHUSDT (15m, 4h)
6. ✅ Виджеты начинают получать данные

### Сценарий 2: Quick Add

1. Пользователь кликает кнопку "SOLUSDT" в Quick Add
2. ✅ Символ добавляется с настройками по умолчанию
3. ✅ Кнопка исчезает из Quick Add
4. ✅ Новый блок появляется в списке

### Сценарий 3: Удаление символа

1. Пользователь кликает "🗑️ Remove" на блоке ETHUSDT
2. ✅ Блок удаляется из списка
3. ✅ WebSocket отписывается от ETHUSDT
4. ✅ Кнопка ETHUSDT появляется в Quick Add

### Сценарий 4: Изменение таймфреймов для новых символов

1. Пользователь меняет LTF на "5m", HTF на "1h"
2. Добавляет новые символы
3. ✅ Все новые символы создаются с LTF: 5m, HTF: 1h
4. ✅ Существующие символы сохраняют свои настройки

## 🎯 Ключевые особенности

### ✅ Независимость блоков

Каждый блок имеет свои:

- Символ
- Таймфреймы (LTF, HTF)
- Виджеты с настройками
- Подписки на данные

### ✅ Умная подписка

- **Автоматическое объединение** всех таймфреймов
- **Дедупликация** через Set
- **Batch updates** - одна подписка на все символы

### ✅ Защита данных

- Нельзя удалить последний символ
- Валидация перед добавлением
- Проверка дубликатов

### ✅ UX оптимизации

- Enter в поле ввода
- Quick Add для популярных символов
- Disabled states при отключении
- Hover эффекты и transitions

## 🔧 Технические детали

### Smart Timeframe Collection

```typescript
// Собираем все уникальные таймфреймы из всех символов
const allTimeframes = [
	...new Set(symbolConfigs.flatMap(config => [config.ltf, config.htf]))
]

// Пример:
// symbolConfigs = [
//   { symbol: 'BTCUSDT', ltf: '1m', htf: '1h' },
//   { symbol: 'ETHUSDT', ltf: '15m', htf: '4h' },
//   { symbol: 'BNBUSDT', ltf: '1m', htf: '1h' }
// ]
//
// allTimeframes = ['1m', '1h', '15m', '4h']
// symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']
//
// subscribe(symbols, allTimeframes)
// → Подписываемся на все комбинации
```

### Widget Data Flow

```
WebSocket Backend (4202)
    ↓
useRegimeSocketSubscription()
    ↓
regimes Map<string, RegimeUpdateData>
    ↓
Key: "BTCUSDT:1m" → Value: { regime, adx, atr, ... }
    ↓
RegimeWidget → reads regimes.get("BTCUSDT:1m")
RegimeHealth → reads regimes.get("BTCUSDT:1m")
RegimeContext → reads regimes for both LTF & HTF
```

### Performance Considerations

1. **React.memo** можно применить к блокам символов
2. **useCallback** для handlers (уже реализовано в хуке)
3. **Virtualization** если символов > 20 (будущая оптимизация)
4. **Lazy loading** виджетов (будущая оптимизация)

## 📊 Сравнение с предыдущей версией

### До изменений:

```
❌ Один набор виджетов для всех символов
❌ Переключение через dropdown
❌ Карточки символов отдельно от виджетов
❌ Единые LTF/HTF для всех символов
```

### После изменений:

```
✅ Отдельный блок виджетов для каждого символа
✅ Все символы видны одновременно
✅ Символ, таймфреймы и виджеты в одном блоке
✅ Индивидуальные LTF/HTF для каждого символа
✅ Вертикальный скролл через блоки
```

## 🎓 Архитектурные принципы

### 1. **Single Responsibility**

Каждый блок отвечает за один символ

### 2. **DRY (Don't Repeat Yourself)**

Переиспользуемые компоненты виджетов

### 3. **Composition over Inheritance**

Блоки собираются из независимых виджетов

### 4. **Separation of Concerns**

- Logic: State management в page компоненте
- UI: Render в return JSX
- Styles: SCSS модули
- Data: WebSocket hook

### 5. **Progressive Enhancement**

- Базовая функциональность без JS
- Enhanced с JS (real-time updates)
- Adaptive design (mobile-first)

## 📁 Файлы

### Modified:

- ✅ `src/app/i/regime-subscriptions/page.tsx` - блочная архитектура
- ✅ `src/app/i/regime-subscriptions/RegimeSubscriptions.module.scss` - новые стили

### New:

- ✅ `REGIME_SUBSCRIPTIONS_BLOCKS.md` - документация

## 🚀 Итог

Создана **профессиональная блочная система** для мониторинга множественных символов одновременно. Каждый символ имеет:

✅ Свой полный набор виджетов  
✅ Индивидуальные настройки таймфреймов  
✅ Независимые подписки на данные  
✅ Удобное управление (добавить/удалить)  
✅ Адаптивный дизайн  
✅ Real-time обновления через WebSocket

**Enterprise-level solution** для трейдинга! 🎯
