# PNG Sparklines & Alerts Integration

## 📋 Обзор

Интеграция серверных PNG спарклайнов и системы алертов о здоровье пайплайна рыночного режима.

## 🎯 Что было реализовано

### 1. **PNG Спарклайны** (`/src/components/sparkline/PngSparkline.tsx`)

Серверный спарклайн-график в формате PNG:

- Генерируется на backend
- Легковесный (просто `<img>` тег)
- Кэшируется браузером
- Альтернатива SVG для простых случаев

### 2. **Хук useRegimeAlerts** (`/src/hooks/useRegimeAlerts.ts`)

WebSocket хук для получения алертов:

- Подключение к событию `'regime:alert'`
- Отслеживание статуса подключения
- Типизированные алерты

### 3. **RegimeAlertToast** (`/src/components/regime-alert/`)

Всплывающий тост с алертами:

- Позиционирование в правом нижнем углу
- Анимации (slide-in, blink, pulse)
- Цветовая индикация по статусу
- Автоматическое скрытие через 8 секунд

### 4. **Интеграция в Layout**

RegimeAlertToast добавлен в корневой layout (`/src/app/layout.tsx`)

### 5. **Обновленные типы TypeScript**

```typescript
export interface RegimeAlert {
	symbol: string
	timeframe: string
	status: HealthStatus
	recovered?: boolean
	lagSec?: number
	issues?: string[]
	timestamp?: string
}
```

## 📁 Структура файлов

```
src/
├── components/
│   ├── sparkline/
│   │   ├── Sparkline.tsx                   ✅ SVG (уже было)
│   │   ├── PngSparkline.tsx                ✅ НОВЫЙ - PNG версия
│   │   ├── SparklineExample.tsx            ✅ НОВЫЙ - примеры
│   │   └── index.ts                        ✅ ОБНОВЛЕНО
│   ├── regime-alert/
│   │   ├── RegimeAlertToast.tsx            ✅ НОВЫЙ
│   │   ├── RegimeAlertToast.module.scss    ✅ НОВЫЙ
│   │   └── index.ts                        ✅ НОВЫЙ
│   └── regime-badge/
│       ├── RegimeWidget.tsx                ✅ ОБНОВЛЕНО - поддержка PNG
│       └── RegimeWidget.module.scss        ✅ ОБНОВЛЕНО
├── hooks/
│   └── useRegimeAlerts.ts                  ✅ НОВЫЙ
├── types/
│   └── signal.types.ts                     ✅ ОБНОВЛЕНО - RegimeAlert
└── app/
    └── layout.tsx                          ✅ ОБНОВЛЕНО - добавлен Toast
```

## 🚀 Использование

### PNG Спарклайн

#### Базовое использование

```tsx
import { PngSparkline } from '@/components/sparkline'

;<PngSparkline
	symbol='BTCUSDT'
	timeframe='1m'
	points={300}
	width={320}
	height={60}
/>
```

#### В RegimeWidget

```tsx
import { RegimeWidget } from '@/components/regime-badge'

;<RegimeWidget
	symbol='BTCUSDT'
	timeframe='1m'
	showSparkline={true}
	sparklineType='png' // 👈 PNG вместо SVG
	sparklinePoints={300}
/>
```

#### Прямое использование

```tsx
<img
	alt='spark'
	width={320}
	height={60}
	src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/regime/sparkline.png?symbol=BTCUSDT&timeframe=1m&points=300&w=320&h=60`}
/>
```

### Система алертов

#### Автоматическая интеграция

Алерты уже интегрированы в `layout.tsx` и работают глобально:

```tsx
// src/app/layout.tsx
import { RegimeAlertToast } from '@/components/regime-alert'

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				{children}
				<RegimeAlertToast /> {/* 👈 Автоматически ловит алерты */}
			</body>
		</html>
	)
}
```

#### Ручное использование хука

```tsx
import { useRegimeAlerts } from '@/hooks/useRegimeAlerts'

export default function CustomComponent() {
	const { lastAlert, isConnected } = useRegimeAlerts()

	if (lastAlert) {
		console.log('Alert received:', lastAlert)
	}

	return <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
}
```

## 📊 API Props

### PngSparkline

```typescript
interface PngSparklineProps {
	symbol: string // Торговая пара (обязательный)
	timeframe: string // Таймфрейм (обязательный)
	points?: number // Количество точек (default: 300)
	width?: number // Ширина в px (default: 320)
	height?: number // Высота в px (default: 60)
	className?: string // CSS класс
}
```

### RegimeWidget (обновлено)

```typescript
interface RegimeWidgetProps {
	// ... существующие props
	sparklineType?: 'svg' | 'png' // 👈 НОВОЕ: тип спарклайна
}
```

### useRegimeAlerts

```typescript
interface UseRegimeAlertsReturn {
	socket: Socket | null
	lastAlert: RegimeAlert | null
	isConnected: boolean
}
```

## 🎨 Формат алертов

### WebSocket Event

Backend должен отправлять событие `'regime:alert'`:

```javascript
// Backend
socket.emit('regime:alert', {
	symbol: 'BTCUSDT',
	timeframe: '1m',
	status: 'error', // 'ok' | 'warn' | 'error'
	recovered: false, // опционально
	lagSec: 250, // опционально
	issues: ['high_lag', 'missing_quantiles'], // опционально
	timestamp: new Date().toISOString()
})
```

### Примеры алертов

#### Error Alert

```json
{
	"symbol": "BTCUSDT",
	"timeframe": "1m",
	"status": "error",
	"lagSec": 350,
	"issues": ["high_lag", "no_data"],
	"timestamp": "2025-10-08T12:00:00.000Z"
}
```

#### Recovered Alert

```json
{
	"symbol": "BTCUSDT",
	"timeframe": "1m",
	"status": "ok",
	"recovered": true,
	"lagSec": 5,
	"timestamp": "2025-10-08T12:05:00.000Z"
}
```

#### Warning Alert

```json
{
	"symbol": "ETHUSDT",
	"timeframe": "5m",
	"status": "warn",
	"lagSec": 120,
	"issues": ["lag_increasing"],
	"timestamp": "2025-10-08T12:00:00.000Z"
}
```

## 🎨 Визуальная индикация

### Alert Colors

| Статус  | Цвет       | Hex       | Значение       |
| ------- | ---------- | --------- | -------------- |
| `ok`    | 🟢 Зеленый | `#22c55e` | Recovered      |
| `warn`  | 🟡 Желтый  | `#eab308` | Предупреждение |
| `error` | 🔴 Красный | `#ef4444` | Ошибка         |

### Анимации

- **slide-in**: Плавное появление справа
- **blink**: 6 раз мигание границей (1 секунда)
- **pulse**: Пульсация индикатора статуса

## 🔧 Backend Requirements

### PNG Sparkline Endpoint

```
GET /regime/sparkline.png

Query params:
- symbol: string (required)
- timeframe: string (required)
- points: number (default: 300)
- w: number (width, default: 320)
- h: number (height, default: 60)

Returns: image/png
```

### WebSocket Alert Event

```javascript
// Событие 'regime:alert'
{
  symbol: string
  timeframe: string
  status: 'ok' | 'warn' | 'error'
  recovered?: boolean
  lagSec?: number
  issues?: string[]
  timestamp?: string
}
```

## 💡 Примеры использования

### Пример 1: SVG vs PNG сравнение

```tsx
import { PngSparkline, Sparkline } from '@/components/sparkline'

export default function ComparisonPage() {
	const mockAdx = Array.from({ length: 100 }, () => Math.random() * 40)
	const mockAtr = Array.from({ length: 100 }, () => Math.random() * 0.03)

	return (
		<div className='grid grid-cols-2 gap-4'>
			{/* SVG - интерактивный */}
			<div>
				<h3>SVG Sparkline</h3>
				<Sparkline
					adx={mockAdx}
					atrPct={mockAtr}
				/>
			</div>

			{/* PNG - легковесный */}
			<div>
				<h3>PNG Sparkline</h3>
				<PngSparkline
					symbol='BTCUSDT'
					timeframe='1m'
				/>
			</div>
		</div>
	)
}
```

### Пример 2: Multi-symbol dashboard

```tsx
const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']

export default function Dashboard() {
	return (
		<div className='grid grid-cols-3 gap-4'>
			{symbols.map(symbol => (
				<div
					key={symbol}
					className='bg-gray-800 p-4 rounded'
				>
					<h4>{symbol}</h4>
					<PngSparkline
						symbol={symbol}
						timeframe='5m'
						width={200}
						height={40}
					/>
				</div>
			))}
		</div>
	)
}
```

### Пример 3: Кастомная обработка алертов

```tsx
import { toast } from 'sonner'

import { useRegimeAlerts } from '@/hooks/useRegimeAlerts'

export default function CustomAlerts() {
	const { lastAlert } = useRegimeAlerts()

	useEffect(() => {
		if (!lastAlert) return

		// Кастомная логика
		if (lastAlert.status === 'error') {
			toast.error(`Pipeline error: ${lastAlert.symbol}/${lastAlert.timeframe}`)
		}
	}, [lastAlert])

	return <div>...</div>
}
```

## 🧪 Тестирование

### 1. PNG Спарклайн

```bash
# Проверьте endpoint
curl "http://localhost:4207/api/regime/sparkline.png?symbol=BTCUSDT&timeframe=1m&points=300&w=320&h=60" --output test.png

# Откройте test.png
```

### 2. WebSocket алерты

```javascript
// test-alerts.js
const { io } = require('socket.io-client')

const socket = io('http://localhost:4202', {
	path: '/socket.io'
})

socket.on('regime:alert', data => {
	console.log('Alert received:', data)
})

// Эмулируйте алерт на сервере
```

### 3. Frontend тестирование

```tsx
// Откройте любую страницу
//localhost:3000/i

// Эмулируйте алерт (на backend):
http: socket.emit('regime:alert', {
	symbol: 'BTCUSDT',
	timeframe: '1m',
	status: 'error',
	lagSec: 300
})

// Должен появиться тост в правом нижнем углу
```

## 📈 Преимущества

### PNG Sparklines

✅ **Легковесность**: Просто `<img>` тег  
✅ **Кэширование**: Браузер автоматически кэширует  
✅ **Серверный рендеринг**: Не нагружает клиент  
✅ **Совместимость**: Работает везде

❌ **Нет интерактивности**: Статичная картинка  
❌ **Зависимость от сервера**: Требует backend endpoint

### SVG Sparklines

✅ **Интерактивность**: Можно добавить hover, click  
✅ **Кастомизация**: Полный контроль над стилями  
✅ **Клиентский**: Не требует backend

❌ **Размер**: Больше кода на клиенте  
❌ **Производительность**: Рендеринг на клиенте

## 🎯 Когда использовать

### Используйте PNG когда:

- Нужна максимальная производительность
- Не требуется интерактивность
- Много спарклайнов на странице
- Backend может генерировать изображения

### Используйте SVG когда:

- Нужна интерактивность (hover, tooltips)
- Требуется динамическая кастомизация
- Backend недоступен для генерации PNG
- Важна векторная масштабируемость

## ✅ Checklist интеграции

### Frontend

- [x] PngSparkline компонент создан
- [x] useRegimeAlerts хук создан
- [x] RegimeAlertToast компонент создан
- [x] SCSS анимации настроены
- [x] TypeScript типы обновлены
- [x] Интеграция в layout выполнена
- [x] RegimeWidget обновлен (поддержка PNG)
- [x] Примеры использования созданы
- [x] Документация написана

### Backend (требуется)

- [ ] Endpoint `/regime/sparkline.png` реализован
- [ ] WebSocket событие `'regime:alert'` настроено
- [ ] Логика генерации PNG изображений
- [ ] Логика определения алертов (health check)

## 🚦 Следующие шаги

1. **Реализуйте Backend**

   - PNG генератор спарклайнов
   - Логика алертов о здоровье

2. **Тестирование**

   - Проверьте PNG endpoint
   - Эмулируйте алерты
   - Проверьте анимации тоста

3. **Оптимизация**
   - Настройте кэширование PNG
   - Добавьте rate limiting для алертов
   - Настройте уровни важности алертов

## 📚 Связанные документы

- [Market Regime Complete](/MARKET_REGIME_COMPLETE.md)
- [Health & Context Widgets](/HEALTH_CONTEXT_WIDGETS.md)
- [Sparklines & Filters](/SPARKLINES_AND_FILTERS_INTEGRATION.md)

---

**Статус**: ✅ Frontend готов | ⏳ Backend требуется  
**Версия**: 1.0.0  
**Дата**: 2025-10-08
