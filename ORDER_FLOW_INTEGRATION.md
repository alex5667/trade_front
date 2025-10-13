# Order Flow Dashboard - Интеграция

## 📋 Обзор

Успешно интегрирован **Order Flow Dashboard** - система мониторинга торговых потоков (Order Flow) с отслеживанием Delta спайков и визуализацией данных в реальном времени.

## 🎯 Что было сделано

### 1. **API сервис** (`src/lib/orderflow-api.ts`)

- `getOfFeatures()` - получение признаков Order Flow
- `getOfSpikes()` - получение Delta спайков
- `getOfSparklineUrl()` - генерация URL для sparkline PNG изображений

### 2. **WebSocket сервис** (`src/lib/orderflow-socket.ts`)

- Реализован синглтон паттерн для Socket.IO соединения
- Подключение к `/signals` namespace для получения данных в реальном времени
- Автоматическое переподключение при разрыве связи

### 3. **Компоненты Order Flow**

#### `OfBadge` (`src/components/order-flow/OfBadge.tsx`)

- Визуальный индикатор Delta спайка
- Поддержка направлений: `long` (зеленый), `short` (красный), `absorbed` (оранжевый)
- Показывает z-Score и соотношение Delta/Volume в tooltip

#### `OfSparkline` (`src/components/order-flow/OfSparkline.tsx`)

- Отображает мини-график Delta в виде PNG изображения
- Динамическая загрузка по API URL
- Оптимизирован для Notion и других сервисов

#### `SpikeTable` (`src/components/order-flow/SpikeTable.tsx`)

- Табличное представление Delta спайков
- Колонки: Time, Δ, zΔ, Δ/Vol, Body/ATR, Direction, Flags
- Адаптивный дизайн с hover эффектами

### 4. **Страница Dashboard** (`src/app/i/(order-flow)/page.tsx`)

- Селекторы для выбора символа и таймфрейма
- Поддерживаемые символы: BTCUSDT, ETHUSDT, SOLUSDT, BNBUSDT, XRPUSDT
- Поддерживаемые таймфреймы: 1m, 3m, 5m, 15m, 1h
- Реал-тайм обновления через WebSocket
- Отображение Sparkline графика Delta
- Список последних 30 баров с метриками
- Таблица последних 50 Delta спайков

### 5. **Конфигурация**

- Добавлен маршрут `ORDER_FLOW: '/i/order-flow'` в `pages-url.config.ts`
- Добавлен пункт меню в `admin-menu.ts` с иконкой `TrendingUp`

## 🔧 Конфигурация API

### Переменные окружения

Добавьте в `.env.local`:

```env
# Order Flow API Base URL (по умолчанию http://localhost:8080)
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

### API Endpoints

Система использует следующие эндпоинты:

- `GET /of/features?symbol={symbol}&timeframe={tf}&limit={n}` - получить признаки OF
- `GET /of/spikes?symbol={symbol}&timeframe={tf}&limit={n}` - получить спайки
- `GET /png/delta?symbol={symbol}&timeframe={tf}&n={n}` - PNG изображение sparkline

### WebSocket Events

Система подписывается на следующие события Socket.IO:

- `of:update` - обновление признаков Order Flow
- `of:spike` - новый Delta спайк

## 📊 Структура данных

### OfFeature (Order Flow признак)

```typescript
{
	ts: string // Временная метка
	delta: number // Delta (разница buy/sell)
	zDelta: number // z-Score Delta
	deltaRatio: number // Соотношение Delta/Volume
	bodyAtr: number // Body/ATR
	absorbed: boolean // Флаг поглощения
	o: number // Open
	h: number // High
	l: number // Low
	c: number // Close
	volume: number // Объем
}
```

### OfSpike (Delta спайк)

```typescript
{
	ts: string // Временная метка
	delta: number // Delta значение
	zDelta: number // z-Score Delta
	deltaRatio: number // Соотношение Delta/Volume
	bodyAtr: number // Body/ATR
	direction: 'long' | 'short' // Направление
	absorbed: boolean // Флаг поглощения
}
```

## 🚀 Использование

### Доступ к странице

1. Перейдите на главную админ панель: `/i`
2. Выберите пункт меню **"Order Flow Dashboard"**
3. Или напрямую: `/i/order-flow`

### Функционал

1. **Выбор инструмента**: Используйте dropdown для выбора торгового символа
2. **Выбор таймфрейма**: Выберите нужный таймфрейм для анализа
3. **Мониторинг спайков**: Отслеживайте Delta спайки в реальном времени
4. **Sparkline URL**: Копируйте URL для использования в Notion или других сервисах

### Интеграция с Notion

Для добавления sparkline графика в Notion:

1. Скопируйте URL из раздела "Δ Sparkline"
2. В Notion вставьте как `/image` блок
3. График будет обновляться динамически

## 🎨 Стилизация

Компоненты используют:

- **Tailwind CSS** для базовой стилизации
- **Inline styles** для динамических цветов (на основе направления спайка)
- **Темная тема** по умолчанию (серые тона)

### Цветовая схема

- **Long (покупка)**: `#22c55e` (зеленый)
- **Short (продажа)**: `#ef4444` (красный)
- **Absorbed (поглощен)**: `#f59e0b` (оранжевый)
- **Delta положительная**: `#0ea5e9` (голубой)
- **Delta отрицательная**: `#f97316` (оранжевый)

## 🔍 Критерии спайка

Сигнал определяется как спайк при соблюдении условий:

- `|zDelta| >= 2.5` - z-Score Delta по модулю >= 2.5
- `|deltaRatio| >= 0.35` - Соотношение Delta/Volume по модулю >= 0.35

## 📁 Структура файлов

```
src/
├── lib/
│   ├── orderflow-api.ts       # API методы
│   └── orderflow-socket.ts    # WebSocket клиент
├── components/
│   └── order-flow/
│       ├── OfBadge.tsx        # Индикатор спайка
│       ├── OfSparkline.tsx    # Sparkline график
│       ├── SpikeTable.tsx     # Таблица спайков
│       └── index.ts           # Экспорты
├── app/
│   └── i/
│       └── (order-flow)/
│           ├── page.tsx       # Главная страница
│           └── layout.tsx     # Layout
└── config/
    └── pages-url.config.ts    # Конфигурация маршрутов
```

## ✅ Чеклист запуска

- [x] API сервис создан
- [x] WebSocket клиент настроен
- [x] Компоненты реализованы
- [x] Страница Dashboard создана
- [x] Маршрут добавлен в конфигурацию
- [x] Пункт меню добавлен в админку
- [x] Нет ошибок линтера
- [x] TypeScript типы определены

## 🐛 Возможные проблемы

### WebSocket не подключается

1. Проверьте переменную окружения `NEXT_PUBLIC_API_BASE`
2. Убедитесь что бэкенд работает на указанном порту
3. Проверьте логи в консоли браузера

### Нет данных

1. Убедитесь что бэкенд API возвращает данные на `/of/features` и `/of/spikes`
2. Проверьте что символ и таймфрейм поддерживаются бэкендом
3. Откройте Network вкладку в DevTools

### Sparkline не загружается

1. Проверьте URL в консоли браузера
2. Убедитесь что эндпоинт `/png/delta` работает
3. Проверьте CORS настройки бэкенда

## 🔜 Возможные улучшения

- [ ] Добавить фильтры по z-Score и deltaRatio
- [ ] Экспорт данных в CSV/Excel
- [ ] Звуковые уведомления при спайках
- [ ] Графики с историей Delta
- [ ] Сравнение нескольких символов
- [ ] Сохранение настроек в localStorage
- [ ] Alerts при достижении порогов

---

**Интеграция завершена успешно!** ✨
