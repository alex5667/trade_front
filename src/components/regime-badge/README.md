# Market Regime Components

Компоненты для отображения рыночного режима в реальном времени через WebSocket.

## Компоненты

### RegimeBadge
Визуальный индикатор рыночного режима с метриками ADX и ATR%.

### RegimeWidget
Полноценный виджет для отображения рыночного режима с индикатором подключения.

## Использование

### Базовое использование RegimeBadge

```tsx
import { RegimeBadge } from '@/components/regime-badge'

export default function MyComponent() {
  return (
    <RegimeBadge 
      regime="trending_bull" 
      adx={25.5} 
      atrPct={0.0234} 
    />
  )
}
```

### Использование с WebSocket (хук useRegimeSocket)

```tsx
'use client'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'
import { RegimeBadge } from '@/components/regime-badge'

export default function Dashboard() {
  const { regime, isConnected } = useRegimeSocket()

  return (
    <div>
      <h2>Market Analysis</h2>
      
      {isConnected ? (
        <RegimeBadge 
          regime={regime?.regime} 
          adx={regime?.adx} 
          atrPct={regime?.atrPct} 
        />
      ) : (
        <p>Connecting to market data...</p>
      )}
    </div>
  )
}
```

### Использование готового виджета RegimeWidget

```tsx
import { RegimeWidget } from '@/components/regime-badge'

export default function TradingPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <RegimeWidget showStatus={true} />
      {/* другие виджеты */}
    </div>
  )
}
```

## Типы режимов

| Режим | Описание | Цвет |
|-------|----------|------|
| `range` | Рынок в диапазоне (флэт) | Серый |
| `squeeze` | Сжатие волатильности | Желтый |
| `trending_bull` | Бычий тренд | Зеленый |
| `trending_bear` | Медвежий тренд | Красный |
| `expansion` | Расширение волатильности | Синий |

## Props

### RegimeBadge

```typescript
interface RegimeBadgeProps {
  regime?: RegimeType | string  // Тип рыночного режима
  adx?: number                   // Average Directional Index
  atrPct?: number               // Average True Range в процентах (0-1)
  className?: string            // Дополнительные CSS классы
}
```

### RegimeWidget

```typescript
interface RegimeWidgetProps {
  className?: string      // Дополнительные CSS классы
  showStatus?: boolean   // Показывать индикатор подключения (default: true)
}
```

## Хук useRegimeSocket

```typescript
interface UseRegimeSocketReturn {
  socket: Socket | null        // Socket.IO инстанс
  regime: RegimeSignal | null  // Данные о режиме
  isConnected: boolean        // Статус подключения
}

interface RegimeSignal {
  regime: RegimeType
  adx?: number
  atrPct?: number
  timestamp?: string
}
```

## Кастомизация

### Изменение цветов

Отредактируйте `COLOR_BY_REGIME` в файле `RegimeBadge.tsx`:

```typescript
const COLOR_BY_REGIME: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  range: {
    bg: 'bg-custom-500/10',
    border: 'border-custom-500',
    text: 'text-custom-500',
    dot: 'bg-custom-500'
  },
  // ...
}
```

### Изменение меток

Отредактируйте `REGIME_LABELS` в файле `RegimeBadge.tsx`:

```typescript
const REGIME_LABELS: Record<string, string> = {
  range: 'Диапазон',
  squeeze: 'Сжатие',
  // ...
}
```

## WebSocket конфигурация

Компонент использует централизованную конфигурацию WebSocket из `/config/websocket.config.ts`.

Для изменения URL WebSocket сервера установите переменную окружения:

```bash
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-server.com
```

## Примеры интеграции

### В Header Dashboard

```tsx
import { RegimeBadge } from '@/components/regime-badge'
import { useRegimeSocket } from '@/hooks/useRegimeSocket'

export const DashboardHeader = () => {
  const { regime } = useRegimeSocket()

  return (
    <header className="flex justify-between items-center p-4">
      <h1>Trading Dashboard</h1>
      <RegimeBadge 
        regime={regime?.regime} 
        adx={regime?.adx} 
        atrPct={regime?.atrPct}
      />
    </header>
  )
}
```

### В Sidebar

```tsx
import { RegimeWidget } from '@/components/regime-badge'

export const Sidebar = () => {
  return (
    <aside className="w-64 p-4 space-y-4">
      <RegimeWidget />
      {/* другие виджеты */}
    </aside>
  )
}
```

### Множественные инстансы для разных таймфреймов

```tsx
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { RegimeBadge } from '@/components/regime-badge'

export const MultiTimeframeRegime = () => {
  const [regime1h, setRegime1h] = useState(null)
  const [regime4h, setRegime4h] = useState(null)
  const [regime1d, setRegime1d] = useState(null)

  useEffect(() => {
    const socket = io('/signals', { path: '/socket.io' })
    
    socket.on('regime:1h', setRegime1h)
    socket.on('regime:4h', setRegime4h)
    socket.on('regime:1d', setRegime1d)

    return () => { socket.close() }
  }, [])

  return (
    <div className="space-y-2">
      <div>1H: <RegimeBadge {...regime1h} /></div>
      <div>4H: <RegimeBadge {...regime4h} /></div>
      <div>1D: <RegimeBadge {...regime1d} /></div>
    </div>
  )
}
```

