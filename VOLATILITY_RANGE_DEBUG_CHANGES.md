# 📝 Изменения для отладки Volatility Range Signals

## Проблема

Volatility Range Signals не отображаются на странице `/i/volatility-range`. Нужно проверить, приходят ли данные с бекенда.

## Внесенные изменения

### 1. Улучшено логирование в Socket.IO Service

**Файл:** `src/services/socket-io.service.ts`

**Изменения:**

- ✅ Добавлено детальное логирование при получении каждого типа сигнала
- ✅ Добавлен подсчет подписчиков на каждое событие
- ✅ Добавлено логирование Redis каналов и их трансляции
- ✅ Добавлен `socket.onAny()` для отслеживания ВСЕХ входящих событий

**Пример логов:**

```
🔧 Настройка обработчиков Socket.IO сигналов...
✅ Настроены обработчики для: signal:volatility, signal:volatilityRange, ...
📨 [Socket.IO] Получен сигнал volatilityRange: {...}
📋 [Socket.IO] Количество подписчиков на volatilityRange: 2
```

### 2. Улучшено логирование в Signal Service

**Файл:** `src/services/signal.service.ts`

**Изменения:**

- ✅ Добавлено логирование для каждого типа события отдельно
- ✅ Каждый обработчик теперь показывает когда получен сигнал

**Пример логов:**

```
🔧 [Signal Service] Подписка на события волатильности...
📩 [Signal Service] Получен volatilityRange
📊 Обрабатываем сигнал волатильности: BTCUSDT (volatilityRange)
💾 Adding volatility range signal to store: BTCUSDT ...
```

### 3. Создана утилита отладки WebSocket

**Файл:** `src/utils/debug-websocket.ts` (новый)

**Функционал:**

- ✅ `checkWebSocketConnection()` - проверка статуса WebSocket
- ✅ `checkReduxStore()` - инспекция данных в Redux
- ✅ `listenForSignals()` - подписка на сигналы в реальном времени
- ✅ `sendTestPing()` - отправка тестового ping
- ✅ `checkAll()` - комплексная проверка всех систем

**Доступ через консоль:**

```javascript
window.__debugWS() // Быстрая проверка
window.__debugWebSocket.checkAll() // То же самое
```

### 4. Добавлена типизация Window

**Файл:** `src/types/window.d.ts` (новый)

**Изменения:**

- ✅ Типы для `window.store`
- ✅ Типы для `window.__socketStats()`
- ✅ Типы для debug утилит
- ✅ Типы для Redux DevTools

### 5. Экспорт Redux Store в Window

**Файл:** `src/providers/providers.tsx`

**Изменения:**

- ✅ Store теперь доступен через `window.store` для отладки
- ✅ Логирование при инициализации

### 6. Импорт debug утилит в Layout

**Файл:** `src/app/i/layout.tsx`

**Изменения:**

- ✅ Импорт `@/utils/debug-websocket` для загрузки утилит
- ✅ Добавлен `'use client'` директива
- ✅ Консольные подсказки при загрузке страницы

### 7. Документация

Созданы файлы документации:

- ✅ `DEBUG_VOLATILITY_RANGE.md` - базовый чеклист
- ✅ `VOLATILITY_RANGE_DEBUG_GUIDE.md` - полное руководство
- ✅ `QUICK_START_DEBUG.md` - быстрый старт
- ✅ `VOLATILITY_RANGE_DEBUG_CHANGES.md` - этот файл

## Как использовать

### Шаг 1: Запустить приложение

```bash
npm run dev
```

### Шаг 2: Открыть страницу

http://localhost:3000/i/volatility-range

### Шаг 3: Открыть консоль (F12)

### Шаг 4: Запустить диагностику

```javascript
window.__debugWS()
```

### Шаг 5: Анализировать результаты

**Если сигналы НЕ приходят:**

- Проверьте что backend запущен на порту 4202
- Проверьте логи backend
- Проверьте Network → WS → Messages

**Если сигналы приходят, но не отображаются:**

- Проверьте Redux Store: `window.store.getState().volatilityRange`
- Проверьте компонент и селекторы
- Вставьте тестовый сигнал вручную (см. QUICK_START_DEBUG.md)

## Что теперь можно отследить

### В консоли браузера:

1. **Статус подключения:**

   ```javascript
   window.__socketStats()
   // { connected: true, isConnecting: false, ... }
   ```

2. **Данные в Redux:**

   ```javascript
   window.store.getState().volatilityRange
   // { signals: [...], lastUpdated: 123456 }
   ```

3. **Входящие сигналы:**

   ```
   📨 [Socket.IO] Получен сигнал volatilityRange: {...}
   ```

4. **Обработка сигналов:**
   ```
   📩 [Signal Service] Получен volatilityRange
   📊 Обрабатываем сигнал волатильности: BTCUSDT
   💾 Adding volatility range signal to store: BTCUSDT
   ```

## Следующие шаги

1. Запустите приложение и диагностику
2. Если сигналы НЕ приходят → проверьте backend
3. Если сигналы приходят → проверьте компонент/Redux
4. Используйте документацию для детальной отладки

## Файлы для справки

- **Полная инструкция:** `VOLATILITY_RANGE_DEBUG_GUIDE.md`
- **Быстрый старт:** `QUICK_START_DEBUG.md`
- **Базовый чеклист:** `DEBUG_VOLATILITY_RANGE.md`
