# 📚 Интеграция Regime Tips - Подсказки по режимам рынка

## ✅ Что было интегрировано

Система подсказок для торговли в различных рыночных режимах с объяснениями gate rules и рекомендациями.

## 📁 Структура файлов

### Новые файлы

```
src/lib/
├── regime-tips.ts          - Типы и константы с подсказками для всех режимов
└── why.ts                   - Логика объяснений gate rules

src/components/regime-tips/
├── RegimeTipsCard.tsx       - Компонент карточки с подсказками
├── RegimeTipsCard.module.scss
├── WhyGateBadge.tsx         - Бейдж "разрешено/заблокировано"
├── WhyGateBadge.module.scss
└── index.ts                 - Экспорт компонентов

src/app/i/regime-tips/
├── page.tsx                 - Демо-страница с примерами
└── RegimeTips.module.scss   - Стили страницы
```

### Измененные файлы

```
src/styles/root-colors.scss           - Добавлены цвета для режимов
src/app/i/regime-dashboard/page.tsx   - Интегрирована карточка подсказок
src/app/i/regime-dashboard/RegimeDashboard.module.scss  - Стили для карточки
```

## 🎯 Функционал

### 1. Regime Tips Card - Карточка подсказок

Отображает детальные рекомендации для текущего режима рынка:

- **Делать** - что работает в этом режиме
- **Избегать** - чего стоит избегать
- **Входы** - типовые точки входа
- **Подтверждения** - чем подтверждать сетап
- **Выходы** - где фиксировать прибыль
- **Риск** - управление рисками
- **Инвалидация** - когда идея сломана
- **Смена режима** - признаки перехода
- **Чек-лист** - быстрая проверка перед входом

### 2. Why Gate Badge - Объяснение gate rules

Показывает:

- Статус сигнала (ALLOWED/BLOCKED)
- Причину блокировки/разрешения
- Подсказки (hints) для правильного использования

### 3. Gate Rules Logic

Автоматическая логика допуска сигналов в зависимости от:

- Текущего режима рынка
- Типа сигнала (FVG, OB, Breaker, Volume, SMT, etc.)
- Направления сделки (long/short) для трендов

## 🚀 Использование

### Базовое использование

```typescript
import { RegimeTipsCard, WhyGateBadge } from '@/components/regime-tips'
import { useRegimeSocket } from '@/hooks/useRegimeSocket'

function MyComponent() {
  const { regime } = useRegimeSocket()
  const currentRegime = regime?.regime || 'range'

  return (
    <div>
      {/* Карточка с подсказками */}
      <RegimeTipsCard regime={currentRegime} />

      {/* Бейдж для сигнала */}
      <WhyGateBadge
        regime={currentRegime}
        type='fvg'
        side='long'
        showTooltip={true}
      />
    </div>
  )
}
```

### В списке сигналов

```typescript
import { WhyGateBadge } from '@/components/regime-tips'

function SignalRow({ signal }) {
  const { regime } = useRegimeSocket()

  return (
    <div className="signal-row">
      <span>{signal.symbol}</span>
      <span>{signal.type}</span>
      <WhyGateBadge
        regime={regime?.regime || 'range'}
        type={signal.type}
        side={signal.side}
        compact={true}
      />
    </div>
  )
}
```

### Программная проверка

```typescript
import { why } from '@/lib/why'

// Проверить можно ли использовать сигнал
const result = why('trending_bull', 'fvg', 'long')

console.log(result.allowed) // true/false
console.log(result.reason) // Причина
console.log(result.hint) // Подсказка (если есть)
```

## 📊 Доступные режимы

1. **range** - Боковик/диапазон
2. **squeeze** - Сжатие/низкая волатильность
3. **trending_bull** - Бычий тренд
4. **trending_bear** - Медвежий тренд
5. **expansion** - Расширение/price discovery

## 🎨 Цветовая схема

```scss
--color-regime-range: #6b7280 // Серый
	--color-regime-squeeze: #eab308 // Желтый
	--color-regime-trending-bull: #22c55e // Зеленый
	--color-regime-trending-bear: #ef4444 // Красный
	--color-regime-expansion: #3b82f6; // Синий
```

## 📄 Страницы

### 1. Демо-страница: `/i/regime-tips`

- Интерактивный выбор режима
- Просмотр всех подсказок
- Проверка gate rules для всех типов сигналов
- Тестирование направлений (long/short)

### 2. Regime Dashboard: `/i/regime-dashboard`

- Карточка подсказок для текущего режима
- Автоматическое обновление при смене режима
- Интеграция с реальными данными WebSocket

## 🔧 Настройка

### Изменение подсказок

Откройте `src/lib/regime-tips.ts` и отредактируйте константу `REGIME_TIPS`:

```typescript
export const REGIME_TIPS: Record<Regime, RegimeTips> = {
	range: {
		key: 'range',
		title: 'Range — боковик/диапазон',
		summary: 'Ваше описание...',
		do: ['Пункт 1', 'Пункт 2'],
		// ... остальные поля
		gateRules: [
			{
				allow: false,
				types: ['fvg'],
				reason: 'Ваше объяснение'
			}
		]
	}
}
```

### Добавление новой логики gate

Откройте `src/lib/why.ts` и добавьте условия в функцию `why()`:

```typescript
export function why(regime: Regime, type: SignalType, side?: TradeSide) {
  // Базовые правила из REGIME_TIPS
  const rule = tips.gateRules.find(r => r.types.includes(type))

  // Добавьте свои условия здесь
  if (/* ваше условие */) {
    return {
      allowed: false,
      reason: 'Ваше объяснение',
      hint: 'Ваша подсказка'
    }
  }

  return { allowed: rule.allow, reason: rule.reason }
}
```

## 💡 Примеры gate rules

### Range (диапазон)

- ❌ **FVG/OB/Breaker** - Пробойные сетапы часто дают фальстарт
- ✅ **SMT** - Дивергенции хорошо отрабатывают возврат к средним
- ✅ **Volume/Volatility** - Разрешено при подтверждении

### Trending Bull (бычий тренд)

- ✅ **FVG/OB/Breaker Long** - По-тренду сетапы приоритетны
- ❌ **FVG/OB/Breaker Short** - Контртренд запрещен
- ✅ **SMT** - Подтверждение/ускорение тренда

### Squeeze (сжатие)

- ❌ **FVG/OB/Breaker** - До выхода из сжатия рискованно
- ✅ **Volume/Volatility** - Триггеры выхода
- ⚠️ **SMT/Other** - Только с подтверждением ADX-slope

## 🚀 Следующие шаги

### 1. Интеграция в существующие компоненты

- Добавьте `WhyGateBadge` в списки сигналов
- Покажите `RegimeTipsCard` в сайдбаре/модалке
- Используйте `why()` для фильтрации сигналов

### 2. Расширенная логика

Добавьте в `why()` проверку:

- ADX-slope
- ATR%-slope
- +DI/−DI соотношения
- HTF bias (тренд на старшем таймфрейме)

### 3. UI улучшения

- Модалка с примерами (скриншоты сетапов)
- Анимация смены режима
- Уведомления при смене важных правил

### 4. Дополнительные подсказки

- Hints-footer под каждым сигналом
- Кнопка "Показать примеры"
- История смены режимов

## 📝 Примечания

- Все подсказки на русском языке
- Компоненты адаптированы под стиль проекта
- Используются существующие цветовые схемы
- Полная типизация TypeScript
- Нет зависимостей от внешних библиотек

## ✨ Готовые страницы

1. **Демо:** http://localhost:3003/i/regime-tips
2. **Dashboard:** http://localhost:3003/i/regime-dashboard

---

**Интеграция завершена! Все компоненты готовы к использованию.**
