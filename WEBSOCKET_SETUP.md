# 🔌 Настройка WebSocket соединения Trade Front ↔ Trade Back

## 📋 Обзор портов

Приложение использует следующие порты:

- **Порт 3003** - Trade Front (Next.js приложение)
- **Порт 4200** - Trade Back REST API (NestJS)
- **Порт 4202** - Trade Back WebSocket Socket.IO сервер

## 🔗 Схема соединений

```
Trade Front (3003) ←→ Trade Back WebSocket (4202) ←→ Trade Back REST API (4200)
```

## ⚙️ Конфигурация

### Trade Front (Next.js)

Trade Front автоматически подключается к WebSocket на порту 4202 через конфигурацию в `src/config/websocket.config.ts`:

```typescript
const DEFAULT_URLS = {
	development: 'http://localhost:4202', // WebSocket порт
	test: 'http://localhost:4202',
	production: 'https://your-production-websocket-url.com'
}
```

### Trade Back (NestJS)

Trade Back запускает:

- REST API на порту 4200 (основное приложение)
- WebSocket сервер на порту 4202 (отдельный worker thread)

## 🚀 Запуск приложений

### 1. Запуск Trade Back

```bash
cd trade_back
export SOCKETIO_PORT=4202
export SOCKETIO_HOST=0.0.0.0
export PORT=4200
npm run start:dev
```

Или используйте готовый скрипт:

```bash
cd trade_back
./start-websocket.sh
```

### 2. Запуск Trade Front

```bash
cd trade_front
npm run dev
```

Trade Front автоматически запустится на порту 3003 и подключится к WebSocket на порту 4202.

## 🔍 Проверка соединения

### Проверка портов

```bash
# Проверить REST API
curl http://localhost:4200/api/health

# Проверить WebSocket (должен быть активен)
lsof -i :4202

# Проверить Trade Front
curl http://localhost:3003
```

### Логи в браузере

Откройте DevTools в браузере и посмотрите на консоль - там должны быть логи подключения к WebSocket:

```
🔧 Конфигурация Socket.IO: {url: "http://localhost:4202", ...}
🟢 Socket.IO client connected: [client-id]
```

## 🚨 Решение проблем

### Ошибка "Connection refused"

1. Убедитесь, что Trade Back запущен
2. Проверьте, что WebSocket работает на порту 4202
3. Проверьте CORS настройки

### Ошибка "Port already in use"

```bash
# Остановить процесс на порту 4202
lsof -ti:4202 | xargs kill -9

# Перезапустить Trade Back
npm run start:dev
```

### WebSocket не подключается

1. Проверьте логи Trade Back на наличие ошибок WebSocket
2. Убедитесь, что переменные окружения установлены правильно
3. Проверьте, что порт 4202 не заблокирован файрволом

## 📱 Использование в коде

### Подключение к WebSocket

```typescript
import { TradeSignalSocketIOClient } from '@/services/socket-io.service'

const socketClient = new TradeSignalSocketIOClient()
socketClient.connect()
```

### Подписка на события

```typescript
socketClient.on('signal:volatility', data => {
	console.log('Получен сигнал волатильности:', data)
})
```

## 🔄 Перезапуск

При изменении конфигурации WebSocket необходимо перезапустить оба приложения:

1. Остановить Trade Back (Ctrl+C)
2. Остановить Trade Front (Ctrl+C)
3. Запустить Trade Back с новыми настройками
4. Запустить Trade Front

## 📝 Примечания

- WebSocket соединение автоматически переподключается при обрыве связи
- Все торговые сигналы передаются через WebSocket в реальном времени
- REST API используется для статических данных и операций CRUD
- CORS настроен для разрешения соединений между портами 3003 и 4202
