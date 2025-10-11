# Отладка Volatility Range Signals

## Проблема

Volatility Range Signals не отображаются на странице `/i/volatility-range`

## Чек-лист проверки

### 1. Проверка WebSocket подключения

Откройте консоль браузера (F12) и проверьте:

- ✅ Есть ли сообщение `✅ Socket.IO успешно подключен, ID: ...`
- ✅ Нет ли ошибок подключения `❌ Ошибка подключения Socket.IO`

### 2. Проверка получения сигналов

В консоли браузера должны быть сообщения:

- `📨 Получен Socket.IO сигнал volatilityRange: {...}`
- `📊 Обрабатываем сигнал волатильности: SYMBOL (volatilityRange)`
- `📊 Отправляем volatilityRange сигнал для SYMBOL`
- `💾 Adding volatility range signal to store: SYMBOL`

### 3. Проверка Redux Store

В консоли браузера выполните:

```javascript
window.__socketStats()
```

Должно показать статус подключения.

Также выполните в консоли:

```javascript
// Проверить текущие сигналы в Redux
const state =
	window.__REDUX_DEVTOOLS_EXTENSION__?.getState?.() ||
	window.store?.getState?.()
console.log('Volatility Range Signals:', state?.volatilityRange?.signals)
console.log('Signals count:', state?.volatilityRange?.signals?.length)
console.log('Last updated:', new Date(state?.volatilityRange?.lastUpdated))
```

### 4. Проверка бекенда

#### Проверьте что бекенд работает на порту 4202:

```bash
curl http://localhost:4202/socket.io/
```

Должен вернуть ответ с информацией о Socket.IO.

#### Проверьте логи бекенда

Бекенд должен отправлять сигналы через:

- `socket.emit('volatilityRange', signal)`
- `socket.emit('signal:volatilityRange', signal)`
- `io.emit('stream:volatilityRange', signal)`

### 5. Network Tab

Откройте вкладку Network в DevTools:

- Найдите соединение с `socket.io`
- Проверьте что статус `101 Switching Protocols`
- Во вкладке WS/Messages должны быть входящие сообщения

## Тестовый скрипт для браузера

Откройте консоль браузера на странице `/i/volatility-range` и выполните:

```javascript
// 1. Проверка WebSocket подключения
console.log('=== WebSocket Status ===')
console.log(window.__socketStats?.())

// 2. Проверка Redux Store
console.log('=== Redux Store Check ===')
const store =
	window.store ||
	(window.__REDUX_DEVTOOLS_EXTENSION__
		? {
				getState: () => window.__REDUX_DEVTOOLS_EXTENSION__.getState()
			}
		: null)

if (store && store.getState) {
	const state = store.getState()
	console.log('Volatility Range State:', state.volatilityRange)
	console.log('Connection State:', state.connection)
	console.log('All Signals:', {
		range: state.volatilityRange?.signals?.length || 0,
		spike: state.volatilitySpike?.signals?.length || 0,
		volatility: state.volatility?.signals?.length || 0
	})
} else {
	console.error('Redux store not available')
}

// 3. Подписка на новые сигналы
console.log('=== Setting up debug listeners ===')
const client =
	window.__socketClient ||
	(() => {
		const SocketIOClient =
			require('@/services/socket-io.service').getSocketIOClient
		return SocketIOClient?.()
	})()

if (client) {
	client.on('volatilityRange', data => {
		console.log('🔥 DEBUG: Received volatilityRange signal:', data)
	})
	client.on('signal:volatilityRange', data => {
		console.log('🔥 DEBUG: Received signal:volatilityRange:', data)
	})
} else {
	console.error('Socket client not available')
}
```

## Возможные проблемы

### Бекенд не отправляет сигналы

- Проверьте что на бекенде правильно настроена эмиссия событий
- Убедитесь что бекенд получает данные из источника (Redis/API)
- Проверьте логи бекенда на наличие ошибок

### Фронтенд не обрабатывает сигналы

- Проверьте что SignalSocketInitializer монтируется в layout
- Убедитесь что initializeSignalService вызывается
- Проверьте нет ли ошибок в обработчиках

### Redux не обновляется

- Проверьте что slice правильно подключен к store
- Убедитесь что action dispatched корректно
- Проверьте Redux DevTools

## Решение

Если сигналы не приходят с бекенда, нужно:

1. Проверить конфигурацию WebSocket на бекенде (порт 4202)
2. Убедиться что бекенд эмитит события с правильными именами
3. Проверить что данные корректно читаются из источника (Redis/DB)

Если сигналы приходят но не отображаются:

1. Проверить Redux slice и reducers
2. Проверить селекторы в компоненте
3. Проверить что компонент правильно рендерит данные
