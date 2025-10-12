# ✅ Regime API - Mock данные удалены

## Изменения

Из `src/services/regime.api.ts` **полностью удалены Mock данные и Fallback**.

---

## Что было удалено

### 1. ❌ Импорты Mock функций

**До:**

```typescript
import {
	generateMockContext,
	generateMockHealth,
	generateMockQuantiles,
	generateMockSeries,
	generateMockSnapshot
} from './regime.mock'

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
```

**После:**

```typescript
// Импорты удалены
```

---

### 2. ❌ Удалены Fallback на Mock в функциях

#### fetchRegimeLatest

**До:**

```typescript
export const fetchRegimeLatest = async (...) => {
  if (USE_MOCK_DATA) {
    console.log('🎭 Mock: fetchRegimeLatest')
    return Promise.resolve(generateMockSnapshot(...))
  }

  try {
    return await getJSON(...)
  } catch (error) {
    console.warn('⚠️ API недоступен, используем mock данные:', error)
    return generateMockSnapshot(...) // ← FALLBACK
  }
}
```

**После:**

```typescript
export const fetchRegimeLatest = async (...) => {
  return await getJSON<RegimeSnapshot>(
    `${API_BASE_URL}/regime/snapshot/latest?...`
  )
}
```

---

#### fetchRegimeRange

**До:** Mock + try/catch с fallback  
**После:** Только API запрос

---

#### fetchRegimeQuantiles

**До:** Mock + try/catch с fallback  
**После:** Только API запрос

---

#### fetchRegimeHealth

**До:** Mock + try/catch с fallback  
**После:** Только API запрос

---

#### fetchRegimeContext

**До:** Mock + try/catch с fallback  
**После:** Только API запрос

---

## Поведение при ошибках

### До (с Mock):

```
Backend недоступен
     ↓
🎭 Используем mock данные
     ↓
Отображается fake данные
```

### После (только реальные данные):

```
Backend недоступен
     ↓
❌ Ошибка выбрасывается
     ↓
Компонент показывает error state
```

---

## Что это означает

### ✅ Преимущества:

1. **Честность данных** - только реальные данные с backend
2. **Явные ошибки** - если backend недоступен, это видно сразу
3. **Нет путаницы** - пользователь не видит fake данные
4. **Чистая консоль** - удалены все console.log/warn для mock

### ⚠️ Требования:

1. **Backend должен работать** на `NEXT_PUBLIC_API_BASE_URL`
2. **Все endpoints должны быть доступны:**
   - `/regime/snapshot/latest`
   - `/regime/snapshot/range`
   - `/regime/quantiles`
   - `/regime/health`
   - `/regime/context`
   - `/regime/agg/hourly`
   - `/regime/agg/daily`

---

## Обработка ошибок в компонентах

### RegimeContext

При ошибке API:

```tsx
<div className={styles.error}>
	{isNetworkError ? (
		<>Backend недоступен. Проверьте API сервер на порту 4207.</>
	) : (
		`Context error: ${error}`
	)}
</div>
```

### RegimeWidget, RegimeHealth

При ошибке API компоненты показывают error state через свою внутреннюю логику.

---

## Проверка

```bash
✅ regime.api.ts - 0 console логов
✅ regime.api.ts - 0 mock imports
✅ regime.api.ts - 0 USE_MOCK_DATA проверок
✅ regime.api.ts - 0 fallback на mock
✅ Линтер не показывает ошибок
```

---

## Endpoints которые должны работать

### Backend API (обязательны)

| Endpoint                  | Метод | Параметры                             | Описание           |
| ------------------------- | ----- | ------------------------------------- | ------------------ |
| `/regime/snapshot/latest` | GET   | symbol, timeframe                     | Последний режим    |
| `/regime/snapshot/range`  | GET   | symbol, timeframe, from?, to?, limit? | Временной ряд      |
| `/regime/quantiles`       | GET   | symbol, timeframe                     | Квантили ADX/ATR%  |
| `/regime/health`          | GET   | symbol, timeframe, maxLagSec          | Здоровье пайплайна |
| `/regime/context`         | GET   | symbol, ltf, htf, signalType?, side?  | LTF/HTF контекст   |
| `/regime/agg/hourly`      | GET   | symbol, timeframe, hours              | Агрегация по часам |
| `/regime/agg/daily`       | GET   | symbol, timeframe, days               | Агрегация по дням  |

**API_BASE_URL:** Берётся из `process.env.NEXT_PUBLIC_API_BASE_URL`

---

## Environment Variables

Убедитесь, что в `.env.local` установлен:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207
```

---

## Что делать при ошибках

### Ошибка: "Network error: Cannot reach..."

**Решение:**

1. Проверьте, что backend запущен
2. Проверьте порт (обычно 4207)
3. Проверьте `NEXT_PUBLIC_API_BASE_URL` в `.env.local`
4. Проверьте CORS настройки на backend

### Ошибка: "HTTP 404"

**Решение:**

1. Убедитесь, что endpoint существует на backend
2. Проверьте версию backend API
3. Проверьте правильность URL в `regime.api.ts`

### Ошибка: "HTTP 500"

**Решение:**

1. Проверьте логи backend сервера
2. Проверьте, что база данных доступна
3. Проверьте правильность параметров запроса

---

## Changelog

### v2.0.0 (Текущая версия - NO MOCK)

- ❌ Удалены все Mock данные
- ❌ Удалены Fallback на mock при ошибках
- ❌ Удалён USE_MOCK_DATA флаг
- ❌ Удалены console.log/warn для mock
- ✅ Только реальные данные с backend
- ✅ Честные ошибки при недоступности API

### v1.0.0 (Старая версия - с Mock)

- ✅ Mock данные для разработки
- ✅ Автоматический Fallback
- ⚠️ Могли показываться fake данные

---

## Миграция

Если вы работали с Mock данными, теперь:

**1. Запустите backend сервер:**

```bash
cd backend
npm run dev
# Убедитесь что работает на порту 4207
```

**2. Проверьте .env.local:**

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4207
```

**3. Перезапустите frontend:**

```bash
npm run dev
```

**4. Проверьте работу:**

- Откройте `/i/regime-dashboard`
- Все виджеты должны показывать реальные данные
- При ошибке увидите "Backend недоступен..."

---

## Итог

**Теперь приложение работает только с реальными данными!**

✅ Никаких Mock данных  
✅ Никаких Fallback  
✅ Только честные ошибки  
✅ Только реальный backend

🚀
