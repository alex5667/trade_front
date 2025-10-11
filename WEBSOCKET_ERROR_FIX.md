# WebSocket Connection Error - Решение

## 🐛 Ошибка

```
Socket.IO connect_error JSON: {
  "url": "http://localhost:4202",
  "errorMessage": "websocket error",
  "errorCode": "UNKNOWN"
}
```

## 🔍 Причина

WebSocket сервер на порту 4202 запущен, но:

1. Не поддерживает namespace `/signals`
2. Или события `'regime'` / `'regime:alert'` не настроены на backend
3. Или CORS блокирует подключение

## ✅ Решение

### 1. Улучшена обработка ошибок подключения

**Компоненты теперь работают без WebSocket!**

#### useRegimeSocket.ts

- ✅ Детальное логирование ошибок
- ✅ Graceful degradation (приложение работает без WebSocket)
- ✅ `console.warn` вместо `console.error` для connect_error

#### useRegimeAlerts.ts

- ✅ Аналогичные улучшения
- ✅ Приложение продолжает работу без алертов

#### RegimeWidget.tsx

- ✅ Индикация режима работы (WebSocket / API only)
- ✅ Показывает "○ API" когда WebSocket отключен
- ✅ Продолжает загружать данные через REST API

### 2. Graceful Degradation

Приложение теперь работает в двух режимах:

#### Режим A: WebSocket Connected ✅

```
● Connected - Live updates
├─ Real-time обновления через WebSocket
├─ Автоматическое обновление графиков
└─ Live алерты
```

#### Режим B: WebSocket Disconnected (API Only) ✅

```
○ API - API only
├─ Данные загружаются через REST API
├─ Графики строятся из исторических данных
└─ Нет live обновлений (но приложение работает!)
```

## 🔧 Что проверить на Backend

### 1. Проверьте WebSocket сервер

```bash
# Убедитесь, что сервер запущен
ss -tuln | grep :4202

# Проверьте логи backend
# Должны видеть попытки подключения от клиента
```

### 2. Проверьте namespace

Backend должен поддерживать namespace `/signals` или корневой namespace:

```javascript
// Backend - правильно
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3003",
    methods: ["GET", "POST"]
  }
})

// Для namespace /signals
const signalsNamespace = io.of('/signals')
signalsNamespace.on('connection', (socket) => {
  console.log('Client connected to /signals')

  // Отправьте тестовое событие
  socket.emit('regime', {
    regime: 'range',
    adx: 18.5,
    atrPct: 0.0156,
    timestamp: new Date().toISOString()
  })
})

// ИЛИ для корневого namespace
io.on('connection', (socket) => {
  console.log('Client connected')
  socket.emit('regime', { ... })
})
```

### 3. Проверьте CORS

```javascript
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3003', // Frontend URL
		methods: ['GET', 'POST'],
		credentials: true
	},
	path: '/socket.io'
})
```

### 4. Тестовый клиент

```javascript
// test-connection.js
const { io } = require('socket.io-client')

const socket = io('http://localhost:4202', {
	path: '/socket.io',
	transports: ['websocket', 'polling']
})

socket.on('connect', () => {
	console.log('✅ Connected:', socket.id)
})

socket.on('connect_error', err => {
	console.error('❌ Connection error:', err.message)
})

socket.on('regime', data => {
	console.log('📊 Regime:', data)
})

// Для namespace /signals
// const socket = io('http://localhost:4202/signals', { ... })
```

## 💡 Текущее поведение приложения

### ✅ Что работает БЕЗ WebSocket:

- ✅ Загрузка данных через REST API
- ✅ RegimeWidget отображает данные
- ✅ RegimeHealth работает
- ✅ RegimeContext работает
- ✅ Спарклайны (SVG и PNG) отображаются
- ✅ SignalsList показывает сигналы

### ❌ Что НЕ работает без WebSocket:

- ❌ Real-time обновления режима
- ❌ Live алерты (RegimeAlertToast)
- ❌ Автоматическое обновление графиков

## 🚀 Варианты решения

### Вариант 1: Запустить Backend WebSocket (рекомендуется)

```bash
# В папке backend
npm run start:websocket
# или
node server.js
```

### Вариант 2: Изменить namespace

Если backend не использует namespace `/signals`:

```typescript
// src/hooks/useRegimeSocket.ts
// Измените на корневой namespace
const socketInstance = io(WEBSOCKET_CONFIG.url, {
	// namespace: '',  // корневой namespace
	path: '/socket.io',
	transports: ['websocket', 'polling']
	// ...
})
```

### Вариант 3: Временно отключить WebSocket

```typescript
// src/hooks/useRegimeSocket.ts
// Добавьте флаг для отключения
const WEBSOCKET_ENABLED = process.env.NEXT_PUBLIC_WEBSOCKET_ENABLED === 'true'

export const useRegimeSocket = () => {
	// ...
	useEffect(() => {
		if (!WEBSOCKET_ENABLED) {
			console.log('⚠️ WebSocket отключен через env')
			return
		}
		// ... остальной код
	}, [])
}
```

## 📝 Логи для диагностики

В консоли браузера вы увидите:

```
⚠️ Regime WebSocket недоступен: {
  message: "websocket error",
  url: "http://localhost:4202",
  note: "Приложение продолжит работу через REST API"
}
```

**Это нормально!** Приложение работает без WebSocket через REST API.

## ✅ Исправления

### useRegimeSocket.ts

- ✅ Улучшенное логирование
- ✅ `console.warn` вместо `console.error`
- ✅ Детальная информация об ошибке
- ✅ Graceful degradation

### useRegimeAlerts.ts

- ✅ Аналогичные улучшения

### RegimeWidget.tsx

- ✅ Индикатор "○ API" при отсутствии WebSocket
- ✅ Tooltip поясняет режим работы
- ✅ Фильтрация обновлений по symbol/timeframe
- ✅ Продолжает работать через REST API

## 🎯 Рекомендации

1. **Для Production**: Настройте backend WebSocket для live обновлений
2. **Для Development**: Приложение работает и без WebSocket
3. **Для Testing**: Используйте режим API only

---

**Статус**: ✅ Исправлено (Graceful degradation)  
**Режим работы**: API only (WebSocket опционален)  
**Дата**: 2025-10-09
