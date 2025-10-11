# 🔍 Руководство по отладке Volatility Range Signals

## Проблема

Volatility Range Signals не отображаются на странице `/i/volatility-range`

## ✅ Что было добавлено для отладки

### 1. Улучшенное логирование

- **Socket.IO Service** (`src/services/socket-io.service.ts`)

  - Детальные логи при получении сигналов
  - Подсчет подписчиков на события
  - Отслеживание ВСЕХ входящих событий через `socket.onAny()`

- **Signal Service** (`src/services/signal.service.ts`)
  - Логирование каждого типа сигнала отдельно
  - Отметки о подписках на события

### 2. Утилиты отладки

- **Debug WebSocket** (`src/utils/debug-websocket.ts`)
  - Проверка статуса WebSocket подключения
  - Инспекция Redux Store
  - Подписка на сигналы в реальном времени
  - Отправка тестового ping

### 3. Доступ через консоль браузера

- `window.store` - Redux store для прямого доступа к данным
- `window.__socketStats()` - статистика WebSocket соединения
- `window.__debugWS()` - быстрая проверка всех систем
- `window.__debugWebSocket` - детальные утилиты отладки

## 📋 Пошаговая инструкция по отладке

### Шаг 1: Запустите приложение

```bash
cd /home/alex/front/trade/trade_front
npm run dev
```

### Шаг 2: Откройте страницу Volatility Range

Перейдите на http://localhost:3000/i/volatility-range

### Шаг 3: Откройте консоль браузера (F12)

Вы должны увидеть следующие сообщения при загрузке:

```
✅ Redux store доступен в window.store для отладки
💡 WebSocket Debug Utils доступны!
Запустите в консоли: window.__debugWS()
🔌 SignalSocketInitializer компонент создан
🔧 Настройка обработчиков Socket.IO сигналов...
✅ Настроены обработчики для: signal:volatility, signal:volatilityRange, volatilitySpike, volatilityRange, priceChange
✅ Настроены обработчики Redis каналов: stream:volatility, stream:volatilityRange, stream:volatilitySpike
🔧 [Signal Service] Подписка на события волатильности...
✅ [Signal Service] Подписки на события волатильности установлены
✅ Socket.IO успешно подключен, ID: xxxx
```

### Шаг 4: Запустите диагностику в консоли

```javascript
// Полная проверка всех систем
window.__debugWS()
```

Это выведет:

- Статус WebSocket подключения
- Данные из Redux Store
- Настроит listeners для новых сигналов
- Отправит тестовый ping

### Шаг 5: Проверьте входящие сигналы

Если сигналы приходят, вы увидите в консоли:

```
📨 [Socket.IO] Получен сигнал volatilityRange: {...}
📋 [Socket.IO] Количество подписчиков на volatilityRange: 2
📩 [Signal Service] Получен volatilityRange
📊 Обрабатываем сигнал волатильности: BTCUSDT (volatilityRange)
📊 Отправляем volatilityRange сигнал для BTCUSDT
💾 Adding volatility range signal to store: BTCUSDT ...
```

### Шаг 6: Проверьте Redux Store

```javascript
// Получить текущее состояние
const state = window.store.getState()

// Проверить сигналы volatilityRange
console.log('Volatility Range Signals:', state.volatilityRange.signals)
console.log('Count:', state.volatilityRange.signals.length)
console.log('Last Updated:', new Date(state.volatilityRange.lastUpdated))

// Проверить подключение
console.log('Connected:', state.connection.isConnected)
console.log('Error:', state.connection.lastError)
```

## 🔥 Что проверить если сигналы НЕ приходят

### 1. Проверьте WebSocket подключение

```javascript
window.__socketStats()
```

Должно показать:

```javascript
{
  connected: true,  // ✅ Должно быть true
  isConnecting: false,
  reconnectAttempts: 0,
  url: "http://localhost:4202"
}
```

Если `connected: false`, проверьте:

- Запущен ли backend на порту 4202
- Нет ли ошибок в консоли (красные сообщения)
- Network tab → WS → проверьте статус соединения

### 2. Проверьте Network Tab

1. Откройте DevTools → Network
2. Найдите `socket.io` соединение
3. Статус должен быть `101 Switching Protocols`
4. Откройте вкладку **WS** или **Messages**
5. Должны быть входящие сообщения

### 3. Проверьте Backend

#### 3.1. Backend работает?

```bash
curl http://localhost:4202/socket.io/
```

Должен вернуть JSON с информацией о Socket.IO

#### 3.2. Backend отправляет сигналы?

Проверьте логи backend. Должны быть сообщения типа:

```
Emitting volatilityRange signal: { symbol: 'BTCUSDT', ... }
```

#### 3.3. Правильные имена событий?

Backend должен использовать одно из этих имен:

- `volatilityRange`
- `signal:volatilityRange`
- `stream:volatilityRange`

### 4. Отслеживайте ВСЕ входящие события

```javascript
// Подключитесь к отслеживанию всех событий
window.__debugWebSocket.listenForSignals()
```

Теперь каждое входящее событие будет логироваться в консоль.

## 🐛 Известные проблемы

### Проблема 1: WebSocket не подключается

**Симптомы:**

- `connected: false` в `window.__socketStats()`
- Ошибки `connect_error` в консоли

**Решение:**

1. Проверьте что backend запущен на порту 4202
2. Проверьте файл `.env` или `NEXT_PUBLIC_WEBSOCKET_URL`
3. Убедитесь что нет CORS ошибок

### Проблема 2: WebSocket подключен, но сигналы не приходят

**Симптомы:**

- `connected: true`
- Нет сообщений `📨 [Socket.IO] Получен сигнал...`

**Решение:**

1. Проверьте логи backend - отправляет ли он сигналы?
2. Проверьте имена событий на backend
3. Проверьте Network → WS → Messages - есть ли входящие сообщения?

### Проблема 3: Сигналы приходят, но не отображаются

**Симптомы:**

- Логи `📨 [Socket.IO] Получен сигнал...` есть
- Redux Store пустой: `state.volatilityRange.signals.length === 0`

**Решение:**

1. Проверьте что обработчики подписаны (логи `✅ [Signal Service] Подписки...`)
2. Проверьте формат данных сигнала - соответствует ли типу?
3. Проверьте нет ли ошибок в slice reducers

### Проблема 4: Redux обновляется, но UI не рендерит

**Симптомы:**

- `state.volatilityRange.signals.length > 0`
- Компонент показывает "No signals available"

**Решение:**

1. Проверьте селекторы в компоненте
2. Проверьте условия рендеринга
3. Добавьте `console.log` в компоненте для отладки

## 📊 Ручная проверка данных

### Вставьте тестовый сигнал в Redux

```javascript
// Получить действие
const {
	addVolatilityRangeSignal
} = require('@/store/signals/slices/volatility-range.slice')

// Создать тестовый сигнал
const testSignal = {
	symbol: 'TESTUSDT',
	type: 'volatilityRange',
	signalType: 'volatilityRange',
	volatility: 2.5,
	range: 0.0023,
	avgRange: 0.0015,
	volatilityChange: 15.5,
	rangeRatio: 1.53,
	interval: '5m',
	timestamp: new Date().toISOString(),
	open: 50000,
	high: 50100,
	low: 50000,
	close: 50080
}

// Отправить в Redux
window.store.dispatch(addVolatilityRangeSignal(testSignal))

// Проверить
console.log(
	'Signals after test:',
	window.store.getState().volatilityRange.signals
)
```

Если тестовый сигнал отображается, значит проблема в получении данных с backend.
Если НЕ отображается - проблема в компоненте или селекторах.

## 🎯 Итоговый чеклист

- [ ] Backend запущен на порту 4202
- [ ] Frontend показывает `✅ Socket.IO успешно подключен`
- [ ] `window.__socketStats()` показывает `connected: true`
- [ ] Network → WS показывает активное соединение
- [ ] Backend отправляет сигналы (проверить логи backend)
- [ ] Консоль показывает `📨 [Socket.IO] Получен сигнал volatilityRange`
- [ ] Redux Store содержит сигналы: `state.volatilityRange.signals.length > 0`
- [ ] Компонент рендерит таблицу с данными

## 💡 Полезные команды для консоли

```javascript
// Быстрая проверка всего
window.__debugWS()

// Проверить только WebSocket
window.__debugWebSocket.checkWebSocketConnection()

// Проверить только Redux
window.__debugWebSocket.checkReduxStore()

// Подписаться на новые сигналы
window.__debugWebSocket.listenForSignals()

// Отправить ping
window.__debugWebSocket.sendTestPing()

// Прямой доступ к store
window.store.getState()

// Статистика socket
window.__socketStats()
```

## 📞 Что делать если ничего не помогло?

1. Соберите логи:

   - Полный вывод консоли браузера
   - Результат `window.__debugWS()`
   - Скриншот Network → WS → Messages
   - Логи backend

2. Проверьте конфигурацию:

   - `src/config/websocket.config.ts`
   - Переменные окружения (`.env`)
   - Backend конфигурацию Socket.IO

3. Создайте issue с собранными данными

## ✨ Автор

Эти инструменты отладки добавлены для упрощения диагностики проблем с WebSocket соединением и получением сигналов.
