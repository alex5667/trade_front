# Market Regime Integration - Руководство

## 📋 Обзор

Интеграция компонентов для отображения рыночного режима (Market Regime) в реальном времени через WebSocket.

## 🎯 Что было добавлено

### 1. **Типы TypeScript** (`/src/types/signal.types.ts`)
```typescript
export type RegimeType = 'range' | 'squeeze' | 'trending_bull' | 'trending_bear' | 'expansion'

export interface RegimeSignal {
  regime: RegimeType
  adx?: number
  atrPct?: number
  timestamp?: string
}
```

### 2. **Хук useRegimeSocket** (`/src/hooks/useRegimeSocket.ts`)
Подключается к WebSocket и получает данные о рыночном режиме:
- Использует существующую конфигурацию из `WEBSOCKET_CONFIG`
- Автоматическое переподключение
- Отслеживание статуса подключения
- Типизированные данные

### 3. **Компонент RegimeBadge** (`/src/components/regime-badge/RegimeBadge.tsx`)
Визуальный индикатор режима с метриками:
- 5 типов режимов с цветовой индикацией
- Отображение ADX и ATR%
- Анимированный индикатор
- Tailwind CSS + SCSS модули
- Accessibility (ARIA)

### 4. **Виджет RegimeWidget** (`/src/components/regime-badge/RegimeWidget.tsx`)
Полноценный виджет для дашборда:
- Автоматическое подключение к WebSocket
- Индикатор статуса подключения
- Timestamp последнего обновления
- Адаптивный дизайн

### 5. **Примеры использования** (`/src/components/regime-badge/RegimeExample.tsx`)
5 готовых примеров интеграции

## 🚀 Быстрый старт

### Вариант 1: Готовый виджет

```tsx
import { RegimeWidget } from '@/components/regime-badge'

export default function Dashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <RegimeWidget showStatus={true} />
    </div>
  )
}
```

### Вариант 2: Кастомная интеграция

```tsx
'use client'

import { useRegimeSocket } from '@/hooks/useRegimeSocket'
import { RegimeBadge } from '@/components/regime-badge'

export default function CustomComponent() {
  const { regime, isConnected } = useRegimeSocket()

  if (!isConnected) return <p>Подключение...</p>

  return (
    <RegimeBadge 
      regime={regime?.regime} 
      adx={regime?.adx} 
      atrPct={regime?.atrPct}
    />
  )
}
```

## 🎨 Типы режимов и их цвета

| Режим | Описание | Цвет | Tailwind |
|-------|----------|------|----------|
| **range** | Рынок в диапазоне (флэт) | Серый | `gray-500` |
| **squeeze** | Сжатие волатильности | Желтый | `yellow-500` |
| **trending_bull** | Бычий тренд | Зеленый | `green-500` |
| **trending_bear** | Медвежий тренд | Красный | `red-500` |
| **expansion** | Расширение волатильности | Синий | `blue-500` |

## 📡 WebSocket конфигурация

Хук использует существующую конфигурацию из `/src/config/websocket.config.ts`:

```typescript
const socketInstance = io(WEBSOCKET_CONFIG.url, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: WEBSOCKET_CONFIG.maxReconnectAttempts,
  reconnectionDelay: WEBSOCKET_CONFIG.reconnectDelay,
  timeout: WEBSOCKET_CONFIG.connectionTimeout,
})
```

### Ожидаемый формат данных от сервера

Сервер должен отправлять событие `'regime'` со следующей структурой:

```json
{
  "regime": "trending_bull",
  "adx": 28.5,
  "atrPct": 0.0234,
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

## 📁 Структура файлов

```
src/
├── hooks/
│   └── useRegimeSocket.ts          # WebSocket хук
├── components/
│   └── regime-badge/
│       ├── RegimeBadge.tsx         # Основной компонент бейджа
│       ├── RegimeBadge.module.scss # Стили бейджа
│       ├── RegimeWidget.tsx        # Виджет для дашборда
│       ├── RegimeWidget.module.scss # Стили виджета
│       ├── RegimeExample.tsx       # Примеры использования
│       ├── index.ts                # Экспорты
│       └── README.md               # Документация
└── types/
    └── signal.types.ts             # TypeScript типы (обновлено)
```

## 🔧 API компонентов

### useRegimeSocket()

```typescript
const { socket, regime, isConnected } = useRegimeSocket()
```

**Возвращает:**
- `socket: Socket | null` - Socket.IO инстанс
- `regime: RegimeSignal | null` - Данные о режиме
- `isConnected: boolean` - Статус подключения

### RegimeBadge

```typescript
interface RegimeBadgeProps {
  regime?: RegimeType | string
  adx?: number
  atrPct?: number
  className?: string
}
```

### RegimeWidget

```typescript
interface RegimeWidgetProps {
  className?: string
  showStatus?: boolean  // default: true
}
```

## 💡 Примеры интеграции

### В Header

```tsx
// src/components/dashboard-layout/header/Header.tsx
import { useRegimeSocket } from '@/hooks/useRegimeSocket'
import { RegimeBadge } from '@/components/regime-badge'

export const Header = () => {
  const { regime } = useRegimeSocket()

  return (
    <header className="flex justify-between p-4">
      <Logo />
      <RegimeBadge {...regime} />
    </header>
  )
}
```

### В Sidebar

```tsx
// src/components/dashboard-layout/sidebar/Sidebar.tsx
import { RegimeWidget } from '@/components/regime-badge'

export const Sidebar = () => {
  return (
    <aside className="space-y-4 p-4">
      <RegimeWidget />
      {/* другие виджеты */}
    </aside>
  )
}
```

### На странице Dashboard (уже реализовано)

```tsx
// src/app/i/UserBoardPage.tsx
import { RegimeWidget } from '@/components/regime-badge'

const UserBoardPage = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        <RegimeWidget showStatus={true} />
      </div>
    </div>
  )
}
```

## 🎨 Кастомизация

### Изменение цветов

Отредактируйте константу `COLOR_BY_REGIME` в `RegimeBadge.tsx`:

```typescript
const COLOR_BY_REGIME: Record<string, {...}> = {
  range: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500',
    text: 'text-purple-500',
    dot: 'bg-purple-500'
  }
}
```

### Изменение меток

Отредактируйте константу `REGIME_LABELS` в `RegimeBadge.tsx`:

```typescript
const REGIME_LABELS: Record<string, string> = {
  range: 'Диапазон',
  squeeze: 'Сжатие',
  // ...
}
```

### Добавление новых режимов

1. Добавьте новый тип в `src/types/signal.types.ts`:
```typescript
export type RegimeType = 'range' | 'squeeze' | 'trending_bull' | 'trending_bear' | 'expansion' | 'new_regime'
```

2. Добавьте цвета в `COLOR_BY_REGIME`
3. Добавьте метку в `REGIME_LABELS`

## 🐛 Отладка

### Проверка подключения WebSocket

```tsx
const { socket, isConnected } = useRegimeSocket()

useEffect(() => {
  console.log('WebSocket Status:', {
    connected: isConnected,
    socketId: socket?.id,
    url: WEBSOCKET_CONFIG.url
  })
}, [socket, isConnected])
```

### Логирование входящих данных

В хуке `useRegimeSocket.ts` добавьте:

```typescript
socketInstance.on('regime', (data: RegimeSignal) => {
  console.log('📊 Regime update:', data)
  setRegime(data)
})
```

## 🔗 Связанные файлы

- [WebSocket конфигурация](/src/config/websocket.config.ts)
- [Документация компонентов](/src/components/regime-badge/README.md)
- [Примеры использования](/src/components/regime-badge/RegimeExample.tsx)
- [Типы сигналов](/src/types/signal.types.ts)

## ✅ Checklist для интеграции

- [x] Типы TypeScript добавлены
- [x] Хук `useRegimeSocket` создан
- [x] Компонент `RegimeBadge` реализован
- [x] Виджет `RegimeWidget` реализован  
- [x] Стили (SCSS + Tailwind) настроены
- [x] Примеры использования созданы
- [x] Документация написана
- [x] Интеграция в UserBoardPage выполнена
- [ ] Backend настроен для отправки событий `'regime'`
- [ ] Тестирование WebSocket подключения

## 🚦 Следующие шаги

1. **Настройте Backend** для отправки событий `'regime'` через Socket.IO
2. **Проверьте работу** WebSocket подключения
3. **Интегрируйте** компоненты в нужные части приложения
4. **Кастомизируйте** под ваш дизайн при необходимости

## 📝 Примечания

- Компоненты полностью типизированы с TypeScript
- Используется существующая WebSocket конфигурация проекта
- Соблюдены best practices: early returns, accessibility, DRY
- Стилизация через Tailwind CSS + SCSS модули
- Готово к production использованию

