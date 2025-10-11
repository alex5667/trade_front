# 🚀 Быстрый старт отладки Volatility Range Signals

## Что нужно сделать СЕЙЧАС

### 1. Запустите приложение

```bash
npm run dev
```

### 2. Откройте страницу

http://localhost:3000/i/volatility-range

### 3. Откройте консоль браузера (F12)

### 4. Запустите диагностику

Введите в консоли:

```javascript
window.__debugWS()
```

## Что вы увидите

### ✅ Если все работает правильно:

```
✅ Socket.IO успешно подключен, ID: xyz123
📨 [Socket.IO] Получен сигнал volatilityRange: {...}
💾 Adding volatility range signal to store: BTCUSDT ...
```

И в диагностике:

```
=== 🔌 WebSocket Connection Status ===
✅ Socket Stats: { connected: true, ... }

=== 📦 Redux Store Data ===
Volatility Range Signals:
  Count: 5
  ✅ Latest signals: [...]
```

### ❌ Если есть проблемы:

#### Проблема 1: WebSocket не подключен

```
❌ Socket Stats: { connected: false }
```

**Действия:**

1. Проверьте что backend запущен: `curl http://localhost:4202/socket.io/`
2. Проверьте логи в консоли на наличие ошибок подключения

#### Проблема 2: Нет сигналов в Redux

```
Volatility Range Signals:
  Count: 0
  ⚠️ No signals in store
```

**Действия:**

1. Проверьте что backend отправляет сигналы (см. логи backend)
2. Проверьте Network → WS → Messages на входящие данные
3. Проверьте консоль на сообщения `📨 [Socket.IO] Получен сигнал`

## Ручное тестирование

### Вставить тестовый сигнал вручную:

```javascript
const testSignal = {
	symbol: 'TESTUSDT',
	type: 'volatilityRange',
	volatility: 2.5,
	range: 0.0023,
	avgRange: 0.0015,
	volatilityChange: 15.5,
	timestamp: new Date().toISOString(),
	interval: '5m'
}

window.store.dispatch(
	require('@/store/signals/slices/volatility-range.slice').addVolatilityRangeSignal(
		testSignal
	)
)
```

Если тестовый сигнал появился в таблице → проблема в получении данных с backend
Если НЕ появился → проблема в компоненте

## Подробная документация

См. `VOLATILITY_RANGE_DEBUG_GUIDE.md` для детальной инструкции.
