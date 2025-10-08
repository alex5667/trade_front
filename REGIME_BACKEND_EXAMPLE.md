# Backend Setup для Market Regime

## 📡 Настройка Socket.IO сервера

### Node.js / Express пример

```javascript
// server.js
const express = require('express')
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST"]
  },
  path: '/socket.io'
})

// Подключение клиента
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Отправляем начальное состояние режима
  socket.emit('regime', {
    regime: 'range',
    adx: 18.5,
    atrPct: 0.0156,
    timestamp: new Date().toISOString()
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Функция обновления режима (вызывается вашей торговой логикой)
function updateRegime(newRegime) {
  io.emit('regime', {
    regime: newRegime.type,          // 'range' | 'squeeze' | 'trending_bull' | 'trending_bear' | 'expansion'
    adx: newRegime.adx,              // Average Directional Index
    atrPct: newRegime.atrPct,        // ATR в процентах (0-1)
    timestamp: new Date().toISOString()
  })
}

// Пример периодического обновления (для тестирования)
setInterval(() => {
  const regimes = ['range', 'squeeze', 'trending_bull', 'trending_bear', 'expansion']
  const randomRegime = regimes[Math.floor(Math.random() * regimes.length)]
  
  updateRegime({
    type: randomRegime,
    adx: Math.random() * 40 + 10,    // 10-50
    atrPct: Math.random() * 0.05     // 0-5%
  })
}, 5000) // каждые 5 секунд

server.listen(4202, () => {
  console.log('WebSocket server running on port 4202')
})
```

### TypeScript пример

```typescript
// server.ts
import express from 'express'
import { Server, Socket } from 'socket.io'
import { createServer } from 'http'

interface RegimeData {
  regime: 'range' | 'squeeze' | 'trending_bull' | 'trending_bear' | 'expansion'
  adx?: number
  atrPct?: number
  timestamp?: string
}

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  },
  path: '/socket.io'
})

// Текущее состояние режима
let currentRegime: RegimeData = {
  regime: 'range',
  adx: 18.5,
  atrPct: 0.0156,
  timestamp: new Date().toISOString()
}

io.on('connection', (socket: Socket) => {
  console.log(`✅ Client connected: ${socket.id}`)

  // Отправляем текущее состояние новому клиенту
  socket.emit('regime', currentRegime)

  socket.on('disconnect', (reason) => {
    console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`)
  })
})

// Функция для обновления режима
export function updateMarketRegime(regime: RegimeData): void {
  currentRegime = {
    ...regime,
    timestamp: new Date().toISOString()
  }
  
  io.emit('regime', currentRegime)
  console.log('📊 Regime updated:', currentRegime)
}

// Экспорт для использования в других модулях
export { io, currentRegime }

const PORT = process.env.WEBSOCKET_PORT || 4202
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`)
})
```

## 🔧 Интеграция с торговой логикой

### Пример расчета режима

```typescript
// marketRegime.service.ts
import { updateMarketRegime } from './server'

interface MarketData {
  high: number[]
  low: number[]
  close: number[]
}

// Расчет ADX (упрощенный пример)
function calculateADX(data: MarketData, period: number = 14): number {
  // Ваша логика расчета ADX
  return 25.5
}

// Расчет ATR
function calculateATR(data: MarketData, period: number = 14): number {
  // Ваша логика расчета ATR
  return 0.0234
}

// Определение режима рынка
function determineRegime(adx: number, atrPct: number, trend: number): string {
  if (adx < 20) {
    return 'range'           // Слабый тренд, рынок в диапазоне
  } else if (adx >= 20 && adx < 25 && atrPct < 0.015) {
    return 'squeeze'         // Сжатие волатильности
  } else if (adx >= 25 && trend > 0) {
    return 'trending_bull'   // Сильный бычий тренд
  } else if (adx >= 25 && trend < 0) {
    return 'trending_bear'   // Сильный медвежий тренд
  } else if (atrPct > 0.03) {
    return 'expansion'       // Расширение волатильности
  }
  return 'range'
}

// Анализ и обновление режима
export function analyzeMarket(marketData: MarketData): void {
  const adx = calculateADX(marketData)
  const atr = calculateATR(marketData)
  const atrPct = atr / marketData.close[marketData.close.length - 1]
  const trend = marketData.close[marketData.close.length - 1] - marketData.close[0]
  
  const regime = determineRegime(adx, atrPct, trend)
  
  updateMarketRegime({
    regime: regime as any,
    adx,
    atrPct,
    timestamp: new Date().toISOString()
  })
}

// Запуск анализа каждые N секунд
setInterval(async () => {
  const marketData = await fetchMarketData() // Ваша функция получения данных
  analyzeMarket(marketData)
}, 10000) // каждые 10 секунд
```

## 🧪 Тестирование

### Тестовый скрипт для проверки

```javascript
// test-regime.js
const { io } = require('socket.io-client')

const socket = io('http://localhost:4202', {
  path: '/socket.io'
})

socket.on('connect', () => {
  console.log('✅ Connected to WebSocket')
})

socket.on('regime', (data) => {
  console.log('📊 Regime update:', data)
})

socket.on('disconnect', () => {
  console.log('❌ Disconnected')
})

socket.on('connect_error', (error) => {
  console.error('🔴 Connection error:', error)
})
```

Запуск:
```bash
node test-regime.js
```

### cURL тест (REST API альтернатива)

```bash
# Если у вас есть REST endpoint для получения текущего режима
curl http://localhost:4207/api/market/regime
```

## 🔐 Безопасность

### Аутентификация клиентов

```typescript
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  
  if (!token) {
    return next(new Error('Authentication error'))
  }
  
  // Проверка токена
  verifyToken(token)
    .then(user => {
      socket.data.user = user
      next()
    })
    .catch(err => next(new Error('Invalid token')))
})
```

### Rate Limiting

```typescript
import rateLimit from 'socket.io-rate-limit'

io.use(rateLimit({
  interval: 1000,    // 1 секунда
  maxConnections: 10 // максимум 10 подключений с одного IP
}))
```

## 📊 Мониторинг

### Логирование событий

```typescript
io.on('connection', (socket) => {
  console.log({
    event: 'client_connected',
    socketId: socket.id,
    timestamp: new Date().toISOString(),
    clientIp: socket.handshake.address
  })

  socket.on('disconnect', (reason) => {
    console.log({
      event: 'client_disconnected',
      socketId: socket.id,
      reason,
      timestamp: new Date().toISOString()
    })
  })
})
```

### Метрики

```typescript
setInterval(() => {
  console.log({
    connectedClients: io.sockets.sockets.size,
    rooms: io.sockets.adapter.rooms.size,
    timestamp: new Date().toISOString()
  })
}, 60000) // каждую минуту
```

## 🐳 Docker настройка

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4202

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  websocket:
    build: .
    ports:
      - "4202:4202"
    environment:
      - NODE_ENV=production
      - FRONTEND_URL=https://your-frontend.com
    restart: unless-stopped
```

## 📝 Переменные окружения

```bash
# .env
WEBSOCKET_PORT=4202
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Redis для масштабирования (опционально)
REDIS_URL=redis://localhost:6379
```

## 🔄 Масштабирование с Redis

```typescript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient))
  console.log('✅ Redis adapter connected')
})
```

## ✅ Checklist Backend

- [ ] Socket.IO сервер настроен на порту 4202
- [ ] CORS настроен для вашего frontend
- [ ] Событие `'regime'` отправляет правильный формат данных
- [ ] Логика расчета режима реализована
- [ ] Аутентификация настроена (если требуется)
- [ ] Логирование и мониторинг настроены
- [ ] Тестирование выполнено

## 🆘 Troubleshooting

### Проблема: Клиент не подключается

```bash
# Проверьте, что сервер запущен
netstat -an | grep 4202

# Проверьте CORS настройки
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     --verbose \
     http://localhost:4202/socket.io/
```

### Проблема: События не приходят

```javascript
// На сервере добавьте логи
io.on('connection', (socket) => {
  console.log('Emitting regime to:', socket.id)
  socket.emit('regime', data)
})

// На клиенте проверьте все события
socket.onAny((event, ...args) => {
  console.log('Received event:', event, args)
})
```

