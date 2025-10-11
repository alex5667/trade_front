# Environment Variables Setup

## 🔧 Настройка переменных окружения

Для работы приложения необходимо настроить переменные окружения.

## 📝 Создайте файл .env.local

В корне проекта создайте файл `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api

# WebSocket Configuration  
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4202

# Optional: Enable/Disable WebSocket
NEXT_PUBLIC_WEBSOCKET_ENABLED=true

# Optional: Mock Data Mode (если backend недоступен)
NEXT_PUBLIC_USE_MOCK_DATA=false
```

## 🚀 Быстрая настройка

### Вариант 1: Скопировать из примера (рекомендуется)

```bash
# В корне проекта
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4202
NEXT_PUBLIC_WEBSOCKET_ENABLED=true
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF
```

### Вариант 2: Создать вручную

1. Создайте файл `.env.local` в корне проекта
2. Скопируйте содержимое выше
3. Сохраните файл

## 🔍 Проверка переменных

```typescript
// В браузере (console)
console.log({
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  wsUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL
})
```

## 📊 Варианты конфигурации

### Конфигурация 1: Полная (Production)

```bash
# Backend на localhost
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4202
NEXT_PUBLIC_WEBSOCKET_ENABLED=true
```

### Конфигурация 2: Только REST API

```bash
# Без WebSocket
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
NEXT_PUBLIC_WEBSOCKET_ENABLED=false
```

### Конфигурация 3: Production сервер

```bash
# Production URLs
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_WEBSOCKET_URL=https://ws.yourdomain.com
NEXT_PUBLIC_WEBSOCKET_ENABLED=true
```

### Конфигурация 4: Mock Data

```bash
# Для разработки без backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207/api
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## 🐛 Troubleshooting

### Ошибка: "Failed to fetch"

**Причина**: Backend недоступен или неверный URL

**Решение**:
1. Проверьте, что backend запущен:
   ```bash
   curl http://localhost:4207/api/regime/snapshot/latest?symbol=BTCUSDT&timeframe=1m
   ```

2. Проверьте переменную окружения:
   ```bash
   # Покажет текущее значение
   grep NEXT_PUBLIC_API_BASE_URL .env.local
   ```

3. После изменения `.env.local` перезапустите dev сервер:
   ```bash
   # Ctrl+C для остановки
   npm run dev
   ```

### Ошибка: "WebSocket error"

**Причина**: WebSocket сервер недоступен

**Решение**:
1. Проверьте WebSocket сервер:
   ```bash
   ss -tuln | grep :4202
   ```

2. Временно отключите WebSocket:
   ```bash
   # В .env.local
   NEXT_PUBLIC_WEBSOCKET_ENABLED=false
   ```

3. Приложение продолжит работать через REST API

### Ошибка: "undefined" вместо URL

**Причина**: Переменная не настроена или файл `.env.local` не создан

**Решение**:
1. Создайте файл `.env.local` (см. выше)
2. Перезапустите `npm run dev`
3. Очистите кэш браузера (Ctrl+Shift+R)

## ✅ Проверка работоспособности

После настройки переменных окружения:

```bash
# 1. Перезапустите сервер
npm run dev

# 2. Откройте браузер
http://localhost:3003/i

# 3. Проверьте консоль браузера
# Должны видеть логи подключения или понятные ошибки
```

## 📝 Примечания

- `.env.local` НЕ комитится в git (уже в `.gitignore`)
- Переменные с префиксом `NEXT_PUBLIC_` доступны в браузере
- После изменения `.env.local` нужен рестарт `npm run dev`
- Для production используйте переменные окружения на сервере

## 🔗 Связанные документы

- [FINAL_INTEGRATION_SUMMARY.md](./FINAL_INTEGRATION_SUMMARY.md) - общий обзор
- [WEBSOCKET_ERROR_FIX.md](./WEBSOCKET_ERROR_FIX.md) - решение WebSocket ошибок
- [README.md](./README.md) - главная документация

---

**Важно**: Создайте `.env.local` файл перед первым запуском!


