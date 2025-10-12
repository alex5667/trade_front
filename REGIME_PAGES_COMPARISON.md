# 📊 Сравнение страниц Regime

## Три страницы Regime системы

---

## 1. 🎯 Regime Dashboard (`/i/regime-dashboard`)

### Назначение:

**Мониторинг фиксированного символа BTCUSDT**

### Особенности:

- ✅ Фиксированный символ: **BTCUSDT**
- ✅ Фиксированные таймфреймы: **1m (LTF), 1h (HTF)**
- ✅ Источник: `useRegimeSocket()`
- ✅ Автоматическое подключение
- ✅ Нет настроек

### Виджеты:

- RegimeWidget (с графиками)
- RegimeHealth (здоровье пайплайна)
- RegimeContext (LTF/HTF контекст)
- RegimeTipsCard (советы по режиму)
- Regime Types Info

### Use Case:

> "Быстрый взгляд на основную пару без настроек"

---

## 2. 📡 Regime Subscriptions (`/i/regime-subscriptions`)

### Назначение:

**Мониторинг множества символов с динамическим выбором**

### Особенности:

- ✅ **Динамический** выбор символа (BTCUSDT, ETHUSDT, и др.)
- ✅ **Динамический** выбор LTF/HTF таймфреймов
- ✅ Источник: `useRegimeSocketSubscription()`
- ✅ Панель управления подписками
- ✅ Subscribe/Unsubscribe кнопки

### Виджеты (идентичны dashboard):

- RegimeWidget (с графиками)
- RegimeHealth (здоровье пайплайна)
- RegimeContext (LTF/HTF контекст)
- RegimeTipsCard (советы по режиму)
- Regime Types Info

### Дополнительно:

- 📡 Subscription Panel (контролы выбора)
- 🟢/🔴 Connection Status
- Счётчик активных подписок

### Use Case:

> "Мониторинг нескольких пар с переключением между ними"

---

## 3. 💡 Regime Tips (`/i/regime-tips`)

### Назначение:

**Справочник по торговым стратегиям в разных режимах**

### Особенности:

- ✅ Выбор режима (range, squeeze, trending, expansion)
- ✅ Детальные советы по каждому режиму
- ✅ Gate rules для типов сигналов
- ✅ Интерактивные примеры

### Виджеты:

- RegimeTipsCard (расширенная версия)
- WhyGateBadge (проверка допустимости сигналов)
- Selector режимов
- Grid с gate rules

### Use Case:

> "Обучение и справка по торговле в различных режимах"

---

## Сравнительная таблица

| Параметр              | Dashboard             | Subscriptions               | Tips             |
| --------------------- | --------------------- | --------------------------- | ---------------- |
| **URL**               | `/i/regime-dashboard` | `/i/regime-subscriptions`   | `/i/regime-tips` |
| **Иконка**            | Gauge 🎯              | Rss 📡                      | Lightbulb 💡     |
| **Символ**            | Фиксированный         | Выбирается                  | N/A              |
| **Таймфрейм**         | Фиксированный         | Выбирается                  | N/A              |
| **Источник**          | useRegimeSocket       | useRegimeSocketSubscription | N/A              |
| **RegimeWidget**      | ✅                    | ✅                          | ❌               |
| **RegimeHealth**      | ✅                    | ✅                          | ❌               |
| **RegimeContext**     | ✅                    | ✅                          | ❌               |
| **RegimeTipsCard**    | ✅                    | ✅                          | ✅ (детальная)   |
| **Панель управления** | ❌                    | ✅                          | ✅ (selector)    |
| **WebSocket**         | Одиночный             | Множественный               | Нет              |

---

## Источники данных

### useRegimeSocket() - Одиночное подключение

```typescript
// regime-dashboard
const { regime, isConnected } = useRegimeSocket('BTCUSDT', '1m')

// WebSocket подключается к:
socket.on('regime', data => {
	// Данные только для BTCUSDT:1m
})
```

### useRegimeSocketSubscription() - Множественные подписки

```typescript
// regime-subscriptions
const { regimes, isConnected, subscribe } = useRegimeSocketSubscription()

// Подписка на несколько пар
subscribe(['BTCUSDT', 'ETHUSDT'], ['1m', '1h'])

// WebSocket подключается к:
socket.on('regime:update', data => {
	// Данные для всех подписанных символов
	regimes.set(`${data.symbol}:${data.timeframe}`, data)
})

// Извлечение конкретного режима
const regime = regimes.get('BTCUSDT:1m')
```

---

## Когда использовать какую страницу

### Используйте Dashboard если:

- 🎯 Нужен быстрый доступ к основной паре (BTCUSDT)
- 🎯 Не нужно менять настройки
- 🎯 Фокус на одном рынке
- 🎯 Простота важнее гибкости

### Используйте Subscriptions если:

- 📡 Нужно мониторить несколько пар
- 📡 Часто переключаетесь между символами
- 📡 Нужны разные таймфреймы для анализа
- 📡 Гибкость важнее простоты

### Используйте Tips если:

- 💡 Изучаете торговые стратегии
- 💡 Нужна справка по режимам
- 💡 Проверяете gate rules для сигналов
- 💡 Учитесь торговать в разных условиях

---

## Навигация между страницами

Все три страницы доступны из **Admin Menu**:

```
Admin Panel
├─ Signal Table
├─ Telegram Signals
├─ Telegram Channels
├─ Trading Symbols
├─ Regime Dashboard       ← Быстрый мониторинг BTCUSDT
├─ Regime Subscriptions   ← Множественные подписки
└─ Regime Tips            ← Обучение и справка
```

---

## Технические детали

### WebSocket Events

**Dashboard (простой):**

```typescript
socket.on('regime', (data: RegimeSignal) => {
	setRegime(data)
})
```

**Subscriptions (с роутингом):**

```typescript
socket.emit('subscribe', {
	symbols: ['BTCUSDT', 'ETHUSDT'],
	timeframes: ['1m', '1h']
})

socket.on('regime:update', (data: RegimeUpdateData) => {
	const key = `${data.symbol}:${data.timeframe}`
	regimes.set(key, data)
})
```

---

## Итоговая схема

```
                    ┌─────────────────┐
                    │   User Action   │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐     ┌──────────┐
    │Dashboard │      │Subscrip- │     │  Tips    │
    │          │      │tions     │     │          │
    │ BTCUSDT  │      │ Dynamic  │     │Reference │
    │  Fixed   │      │ Multi    │     │  Manual  │
    └─────┬────┘      └─────┬────┘     └──────────┘
          │                 │
          ▼                 ▼
    useRegimeSocket  useRegimeSocketSubscription
          │                 │
          └────────┬────────┘
                   │
                   ▼
            ┌─────────────┐
            │  WebSocket  │
            │  Backend    │
            └─────────────┘
```

---

## Выводы

**regime-subscriptions теперь:**

✅ Полностью идентична dashboard по UI/UX  
✅ Использует те же компоненты  
✅ Имеет те же виджеты  
✅ **Отличается только источником данных**  
✅ Добавлена панель управления подписками  
✅ Поддерживает множественные символы

**Готово к использованию! 🎉**
