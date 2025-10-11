# 🔍 Отладка Volatility Range Signals - Инструкция

## 🎯 Цель

Проверить, приходят ли данные Volatility Range Signals с бекенда и почему они не отображаются.

## ✅ Установлено

### Инструменты отладки

- ✅ Детальное логирование WebSocket событий
- ✅ Отслеживание Redux обновлений
- ✅ Утилиты для проверки через консоль браузера
- ✅ Документация и чеклисты

### Измененные файлы

```
✅ src/services/socket-io.service.ts    - Улучшенное логирование
✅ src/services/signal.service.ts       - Детальные логи
✅ src/app/i/layout.tsx                 - Импорт debug утилит
✅ src/providers/providers.tsx          - Экспорт store
✅ src/utils/debug-websocket.ts         - Утилиты отладки (НОВЫЙ)
✅ src/types/window.d.ts                - Типизация (НОВЫЙ)
```

## 🚀 Быстрый старт

### 1. Приложение уже запущено на порту 3003

```bash
# Приложение работает на:
http://localhost:3003/i/volatility-range
```

### 2. Откройте страницу в браузере

```
http://localhost:3003/i/volatility-range
```

### 3. Откройте консоль (F12)

### 4. Запустите диагностику

```javascript
window.__debugWS()
```

## 📊 Что вы увидите

### ✅ Если все работает:

```
=== 🔌 WebSocket Connection Status ===
✅ Socket Stats: { connected: true, isConnecting: false, ... }

=== 📦 Redux Store Data ===
Connection State: { isConnected: true }
Is Connected: ✅

Volatility Range Signals:
  Count: 5
  Last Updated: 10/10/2025, 6:00:00 AM
  Latest signals: [...]
```

В логах консоли:

```
✅ Socket.IO успешно подключен
📨 [Socket.IO] Получен сигнал volatilityRange: {...}
📩 [Signal Service] Получен volatilityRange
💾 Adding volatility range signal to store: BTCUSDT
```

### ❌ Если есть проблемы:

#### Проблема 1: WebSocket не подключен

```
❌ Socket Stats: { connected: false }
```

**Проверьте:**

```bash
# Backend работает?
curl http://localhost:4202/socket.io/
```

#### Проблема 2: Нет сигналов

```
✅ Socket Stats: { connected: true }
Volatility Range Signals: Count: 0
```

**Проверьте:**

1. Логи backend - отправляет ли сигналы?
2. Network → WS → Messages - приходят ли данные?
3. Консоль - есть ли сообщения `📨 [Socket.IO] Получен сигнал`?

## 🔧 Полезные команды

### Проверка статуса

```javascript
// WebSocket статус
window.__socketStats()

// Redux данные
window.store.getState().volatilityRange

// Количество сигналов
window.store.getState().volatilityRange.signals.length
```

### Ручное тестирование

```javascript
// Добавить тестовый сигнал
const {
	addVolatilityRangeSignal
} = require('@/store/signals/slices/volatility-range.slice')

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

window.store.dispatch(addVolatilityRangeSignal(testSignal))

// Проверить
console.log('Signals:', window.store.getState().volatilityRange.signals)
```

### Подписаться на новые события

```javascript
window.__debugWebSocket.listenForSignals()
// Теперь все входящие сигналы будут логироваться
```

## 📋 Чеклист отладки

- [ ] Страница открыта: http://localhost:3003/i/volatility-range
- [ ] Консоль открыта (F12)
- [ ] Запущена диагностика: `window.__debugWS()`
- [ ] WebSocket подключен: `{ connected: true }`
- [ ] Backend работает: `curl http://localhost:4202/socket.io/`
- [ ] Логи показывают входящие сигналы
- [ ] Redux Store содержит данные
- [ ] UI отображает таблицу

## 📚 Документация

### Краткие руководства

- **⭐ НАЧНИТЕ ЗДЕСЬ:** `QUICK_START_DEBUG.md`
- **Полное руководство:** `VOLATILITY_RANGE_DEBUG_GUIDE.md`
- **Список изменений:** `VOLATILITY_RANGE_DEBUG_CHANGES.md`
- **Итоговая сводка:** `SUMMARY.md`

### Что проверить в каждом файле

#### QUICK_START_DEBUG.md

- Пошаговая инструкция запуска
- Что делать если проблемы
- Ручное тестирование

#### VOLATILITY_RANGE_DEBUG_GUIDE.md

- Детальная диагностика
- Решение типичных проблем
- Тестовые скрипты для консоли

#### SUMMARY.md

- Общая сводка всех изменений
- Быстрая навигация
- Чеклист диагностики

## 🎯 Ожидаемый результат

После выполнения диагностики вы узнаете:

1. **WebSocket подключен?** → `window.__socketStats()`
2. **Сигналы приходят с backend?** → Логи в консоли
3. **Redux обновляется?** → `window.store.getState()`
4. **UI отображает данные?** → Проверка страницы

## 💡 Советы

1. **Начните с `window.__debugWS()`** - это даст полную картину
2. **Проверяйте Network → WS** - увидите реальные сообщения
3. **Смотрите логи** - все действия детально логируются
4. **Тестируйте вручную** - вставьте тестовый сигнал

## 🐛 Частые проблемы

### "Cannot read property 'getState' of undefined"

→ Перезагрузите страницу после загрузки приложения

### "WebSocket connection failed"

→ Проверьте что backend запущен на порту 4202

### "Signals не отображаются"

→ Вставьте тестовый сигнал, чтобы проверить UI

---

**Все готово! Запустите `window.__debugWS()` в консоли браузера.**
