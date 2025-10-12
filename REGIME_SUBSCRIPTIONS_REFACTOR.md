# ✅ Regime Subscriptions - Рефакторинг

## Задача

Сделать `@regime-subscriptions/` полностью похожей на `@regime-dashboard/` с отличием только в источнике получения сигналов.

**Статус:** ВЫПОЛНЕНО ✅

---

## Изменения

### 1. ✅ Переписана страница regime-subscriptions/page.tsx

**До:**

- Использовал только `RegimeSubscriptionManager`
- Простой UI с управлением подписками
- Не было виджетов анализа

**После:**

- Полная копия структуры `regime-dashboard`
- Все те же виджеты (RegimeWidget, RegimeContext, RegimeHealth, RegimeTipsCard)
- Добавлена панель управления подписками
- Grid layout как в dashboard

---

### 2. ✅ Обновлены стили RegimeSubscriptions.module.scss

**Скопированы стили из `RegimeDashboard.module.scss`:**

- `.grid` - grid layout для виджетов
- `.mainWidget` - полноширинный виджет
- `.healthWidget`, `.contextWidget` - auto placement
- `.infoPanel` - панель с информацией
- `.regimeList`, `.regimeItem`, `.regimeDot` - список режимов
- `.tipsWidget` - полноширинный виджет с советами

**Добавлены уникальные стили для subscriptions:**

- `.subscriptionPanel` - панель управления подписками
- `.controls` - контролы выбора
- `.select` - dropdown списки
- `.subscribeButton`, `.unsubscribeButton` - кнопки
- `.status` - статус подключения
- `.connected`, `.disconnected` - цвета статуса

---

## Ключевое отличие: Источник данных

### regime-dashboard (одиночный WebSocket)

```typescript
import { useRegimeSocket } from '@/hooks/useRegimeSocket'

const [symbol] = useState('BTCUSDT') // Фиксированный
const [ltf] = useState('1m') // Фиксированный

const { regime: liveRegime } = useRegimeSocket(symbol, ltf)
```

**Источник:** `useRegimeSocket()` - подключается к одному символу/таймфрейму

---

### regime-subscriptions (множественные подписки)

```typescript
import { useRegimeSocketSubscription } from '@/hooks/useRegimeSocketSubscription'

const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT') // Динамический
const [ltf, setLtf] = useState('1m') // Динамический
const [htf, setHtf] = useState('1h') // Динамический

const { regimes, isConnected, subscribe, unsubscribe } =
	useRegimeSocketSubscription()

// Подписка на выбранные символы
subscribe([selectedSymbol], [ltf, htf])

// Получение данных из Map
const currentRegimeKey = `${selectedSymbol}:${ltf}`
const liveRegime = regimes.get(currentRegimeKey)
```

**Источник:** `useRegimeSocketSubscription()` - подписки на множество символов/таймфреймов

---

## Структура страницы regime-subscriptions

```
┌─────────────────────────────────────────────────────┐
│ Market Regime Subscriptions                         │
│ Comprehensive market analysis with multi-symbol...  │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ 📡 Subscription Panel (УНИКАЛЬНО)               │ │
│ │                                                 │ │
│ │ Symbol: [BTCUSDT ▾]  LTF: [1m ▾]  HTF: [1h ▾]  │ │
│ │ [📡 Subscribe]  [Unsubscribe All]               │ │
│ │ 🟢 Connected • Subscriptions: 2                 │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ RegimeWidget (BTCUSDT 1m)                       │ │
│ │ • Live regime indicator                         │ │
│ │ • ADX/ATR% sparklines                           │ │
│ └─────────────────────────────────────────────────┘ │
├──────────────────────┬──────────────────────────────┤
│ RegimeHealth         │ RegimeContext               │
│ • Pipeline status    │ • LTF/HTF comparison        │
│ • Lag monitoring     │ • Signal gate status        │
├──────────────────────┴──────────────────────────────┤
│ Regime Types Info                                  │
│ • Range, Squeeze, Trending Bull/Bear, Expansion    │
├─────────────────────────────────────────────────────┤
│ RegimeTipsCard                                     │
│ • Trading recommendations for current regime       │
└─────────────────────────────────────────────────────┘
```

---

## Сравнение страниц

| Параметр              | regime-dashboard          | regime-subscriptions            |
| --------------------- | ------------------------- | ------------------------------- |
| **Источник данных**   | `useRegimeSocket()`       | `useRegimeSocketSubscription()` |
| **Символы**           | 1 фиксированный (BTCUSDT) | Динамический выбор              |
| **Таймфреймы**        | 2 фиксированных (1m, 1h)  | Динамический выбор              |
| **Управление**        | Нет                       | Панель подписок                 |
| **RegimeWidget**      | ✅                        | ✅                              |
| **RegimeHealth**      | ✅                        | ✅                              |
| **RegimeContext**     | ✅                        | ✅                              |
| **RegimeTipsCard**    | ✅                        | ✅                              |
| **Regime Types Info** | ✅                        | ✅                              |
| **Grid Layout**       | ✅                        | ✅                              |
| **Стили**             | Идентичные                | Идентичные + subscription panel |

---

## Компоненты

### Одинаковые (используются в обеих страницах)

1. **RegimeWidget**

   ```tsx
   <RegimeWidget
   	symbol={selectedSymbol}
   	timeframe={ltf}
   	showStatus={true}
   	showSparkline={true}
   	sparklinePoints={300}
   />
   ```

2. **RegimeHealth**

   ```tsx
   <RegimeHealth
   	symbol={selectedSymbol}
   	timeframe={ltf}
   	maxLagSec={180}
   	refreshInterval={15000}
   />
   ```

3. **RegimeContext**

   ```tsx
   <RegimeContext
   	symbol={selectedSymbol}
   	ltf={ltf}
   	htf={htf}
   	signalType='fvg'
   	side='long'
   	refreshInterval={15000}
   />
   ```

4. **RegimeTipsCard**
   ```tsx
   <RegimeTipsCard
   	regime={currentRegime}
   	compact={false}
   />
   ```

### Уникальные для regime-subscriptions

**Панель управления подписками:**

```tsx
<div className={styles.subscriptionPanel}>
  <div className={styles.controls}>
    <select value={selectedSymbol} onChange={...}>
      {POPULAR_SYMBOLS.map(sym => <option>{sym}</option>)}
    </select>

    <select value={ltf} onChange={...}>
      {AVAILABLE_TIMEFRAMES.map(tf => <option>{tf.label}</option>)}
    </select>

    <button onClick={handleSubscribe}>📡 Subscribe</button>
    <button onClick={unsubscribe}>Unsubscribe All</button>
  </div>

  <div className={styles.status}>
    🟢 Connected • Subscriptions: {regimes.size}
  </div>
</div>
```

---

## Использование

### regime-dashboard

**URL:** `/i/regime-dashboard`

**Use case:** Мониторинг одного фиксированного символа (BTCUSDT)

**Когда использовать:**

- Нужен быстрый доступ к основной паре
- Фокус на одном рынке
- Простой setup без настроек

---

### regime-subscriptions

**URL:** `/i/regime-subscriptions`

**Use case:** Мониторинг множества символов с динамическим выбором

**Когда использовать:**

- Нужно переключаться между парами
- Мониторинг нескольких рынков
- Гибкий выбор таймфреймов

---

## Добавлено в админ-меню

**admin-menu.ts:**

```typescript
{
  icon: Rss,
  link: `${ADMINBOARD_PAGES.REGIME_SUBSCRIPTIONS}`,
  name: 'Regime Subscriptions',
  endPoint: null
}
```

**Иконка:** Rss (📡 подписки/feed)

---

## Проверки

```bash
✅ page.tsx - Все компоненты идентичны dashboard
✅ RegimeSubscriptions.module.scss - Стили скопированы + subscription panel
✅ pages-url.config.ts - Добавлен REGIME_SUBSCRIPTIONS
✅ admin-menu.ts - Добавлена ссылка с иконкой Rss
✅ Линтер не показывает ошибок
✅ Источник данных: useRegimeSocketSubscription (отличие)
```

---

## Панель управления подписками

### Контролы:

1. **Symbol dropdown:**

   - BTCUSDT, ETHUSDT, BNBUSDT, SOLUSDT, ADAUSDT
   - Динамический выбор

2. **LTF dropdown:**

   - 1m, 5m, 15m, 1h, 4h
   - Выбор low timeframe

3. **HTF dropdown:**

   - 1m, 5m, 15m, 1h, 4h
   - Выбор high timeframe

4. **Subscribe button:**

   - Подписка на выбранные символы и таймфреймы
   - Disabled при отключении WebSocket

5. **Unsubscribe All:**
   - Отмена всех подписок
   - Очистка данных

### Статус:

- 🟢 Connected / 🔴 Disconnected
- Subscriptions: {count}

---

## Данные из подписок

### Как работает:

```typescript
// 1. Подписка
subscribe(['BTCUSDT'], ['1m', '1h'])

// 2. Данные приходят через WebSocket
regimes = Map {
  'BTCUSDT:1m' => { regime: 'trending_bull', adx: 28.5, ... },
  'BTCUSDT:1h' => { regime: 'range', adx: 18.3, ... }
}

// 3. Извлечение для виджетов
const currentRegimeKey = `${selectedSymbol}:${ltf}`
const liveRegime = regimes.get(currentRegimeKey)
const currentRegime = liveRegime?.regime || 'range'

// 4. Передача в компоненты
<RegimeWidget symbol={selectedSymbol} timeframe={ltf} />
<RegimeHealth symbol={selectedSymbol} timeframe={ltf} />
<RegimeContext symbol={selectedSymbol} ltf={ltf} htf={htf} />
<RegimeTipsCard regime={currentRegime} />
```

---

## Итоговая структура

```
src/app/i/
├── regime-dashboard/          # Фиксированный символ (BTCUSDT)
│   ├── page.tsx              # useRegimeSocket()
│   └── RegimeDashboard.module.scss
│
├── regime-subscriptions/      # Динамический выбор (множество)
│   ├── page.tsx              # useRegimeSocketSubscription()
│   └── RegimeSubscriptions.module.scss
│
└── regime-tips/               # Справочник по режимам
    ├── page.tsx
    └── RegimeTips.module.scss
```

---

## Меню приложения

Теперь в админ-панели:

1. Signal Table (Activity 📊)
2. Telegram Signals (MessageSquare 💬)
3. Telegram Channels (MessageSquare 💬)
4. Trading Symbols (Coins 💰)
5. **Regime Dashboard (Gauge 🎯)** ← Фиксированный
6. **Regime Subscriptions (Rss 📡)** ← НОВОЕ! Динамический
7. Regime Tips (Lightbulb 💡)

---

## Итог

**Страница regime-subscriptions теперь:**

- ✅ Полностью похожа на regime-dashboard
- ✅ Те же виджеты (RegimeWidget, Health, Context, Tips)
- ✅ Тот же grid layout
- ✅ Те же стили
- ✅ **ОТЛИЧИЕ:** Источник данных - `useRegimeSocketSubscription()`
- ✅ **BONUS:** Панель управления подписками (выбор символа/таймфреймов)
- ✅ Добавлена в админ-меню

**Готово к использованию! 🚀**
