# Symbols Excel Import - Документация

## Обзор

Реализован функционал импорта торговых символов из Excel файлов по аналогии с Telegram Channels.

## Структура файлов

### Созданные компоненты

```
src/
├── components/
│   └── symbol-to-redis/
│       └── SymbolsExcelUploader.tsx  ✅ СОЗДАН
├── app/
│   └── i/
│       └── symbols-to-redis/
│           ├── page.tsx              ✅ ОБНОВЛЁН
│           └── page.module.scss      ✅ ОБНОВЛЁН
```

### Используемые сервисы (уже существуют)

```typescript
// src/services/symbol-to-redis.api.ts
useUploadExcelDataMutation() // Загрузка данных
useGetExcelImportInfoQuery() // Информация о импорте
useDownloadExcelTemplateMutation() // Скачивание шаблона
```

## Компоненты

### 1. SymbolsExcelUploader

**Расположение:** `src/components/symbol-to-redis/SymbolsExcelUploader.tsx`

**Функциональность:**

- 📁 Загрузка Excel файлов (.xlsx, .xls)
- 📊 Выбор нескольких листов для импорта
- ✅ Валидация данных на клиенте (Zod schema)
- 📈 Progress bar и отображение статуса
- ❌ Детальное отображение ошибок
- 📝 Подсказки по формату колонок

**Ожидаемые колонки Excel:**

| Колонка          | Тип    | Обязательно | Описание                                                |
| ---------------- | ------ | ----------- | ------------------------------------------------------- |
| `Symbol`         | string | ✅ Да       | Торговый символ (например, BTCUSDT)                     |
| `BaseAsset`      | string | ❌ Нет      | Базовая валюта (например, BTC)                          |
| `QuoteAsset`     | string | ❌ Нет      | Котируемая валюта (например, USDT)                      |
| `InstrumentType` | enum   | ❌ Нет      | SPOT, FUTURES, FOREX, METAL, INDEX, CRYPTO_INDEX, OTHER |
| `Exchange`       | string | ❌ Нет      | Название биржи (например, Binance)                      |
| `Status`         | string | ❌ Нет      | Статус символа                                          |
| `Note`           | string | ❌ Нет      | Заметка или комментарий                                 |
| `Timeframes`     | string | ❌ Нет      | Таймфреймы через запятую: M1,M5,H1,H4,D1                |

**Пример валидной строки:**

```
Symbol      | BaseAsset | QuoteAsset | InstrumentType | Exchange | Timeframes
BTCUSDT     | BTC       | USDT       | SPOT           | Binance  | M1,M5,M15,H1,H4,D1
ETHUSDT     | ETH       | USDT       | SPOT           | Binance  | M5,M15,H1,D1
BTCUSD      | BTC       | USD        | FUTURES        | Bybit    | M1,M5,H1
```

### 2. Обновленная страница

**Расположение:** `src/app/i/symbols-to-redis/page.tsx`

**Изменения:**

- ✅ Добавлено состояние `showExcelUploader`
- ✅ Кнопка "📊 Загрузить из Excel"
- ✅ Переключение между списком и загрузчиком
- ✅ Кнопка "← Назад к списку"

**Структура экрана:**

```
┌─────────────────────────────────────────────────────┐
│  Управление торговыми символами   [📊 Загрузить...] │
│  Создавайте, редактируйте...                        │
├─────────────────────────────────────────────────────┤
│  [Список символов / Загрузчик Excel]                │
│                                                      │
│  Статистика:                                         │
│  Всего символов: 150                                │
│  На странице: 100                                    │
└─────────────────────────────────────────────────────┘
```

## API Endpoints

### Backend endpoints (уже существуют)

```typescript
// Информация о импорте
GET /symbols/excel/info

// Скачать шаблон Excel
GET /symbols/excel/template

// Загрузить данные
POST /symbols/excel/upload
Content-Type: application/json
Body: RowDTO[]

// Response:
{
  importedCount: number,
  errorCount: number,
  errors: Array<{ row: number, message: string }>
}
```

## Использование

### Пользовательский сценарий

1. **Переход к импорту:**

   - Открыть страницу `/i/symbols-to-redis`
   - Нажать кнопку "📊 Загрузить из Excel"

2. **Выбор файла:**

   - Нажать "Choose File"
   - Выбрать Excel файл (.xlsx или .xls)

3. **Выбор листов:**

   - После загрузки автоматически выбираются все листы
   - Можно снять галочки с ненужных листов
   - Отображается количество строк в каждом листе

4. **Импорт:**

   - Нажать "Импортировать"
   - Дождаться завершения (progress bar)
   - Проверить результаты

5. **Обработка ошибок:**

   - Если есть ошибки, они отображаются в развернутом блоке
   - Показывается номер строки и описание ошибки
   - Можно исправить Excel и повторить импорт

6. **Возврат к списку:**
   - Нажать "← Назад к списку"
   - Список автоматически обновится

### Программное использование

```tsx
import SymbolsExcelUploader from '@/components/symbol-to-redis/SymbolsExcelUploader'

function MyPage() {
	return (
		<div>
			<h1>Импорт символов</h1>
			<SymbolsExcelUploader />
		</div>
	)
}
```

## Валидация

### Client-side (Zod)

```typescript
const RowSchema = z.object({
  symbol: z.string().min(1),                    // Обязательно
  baseAsset: z.string().optional(),
  quoteAsset: z.string().optional(),
  instrumentType: z.enum([...]).optional(),
  exchange: z.string().optional(),
  status: z.string().optional(),
  note: z.string().optional(),
  timeframes: z.array(z.string()).optional()
})
```

### Нормализация данных

#### InstrumentType

- `SPOT`, `FUTURES`, `FOREX`, `METAL`, `INDEX`, `CRYPTO_INDEX`, `OTHER`
- Case-insensitive
- Неизвестные значения → `OTHER`

#### Timeframes

- Разделители: `,` `;` `/`
- Преобразование в uppercase: `m1` → `M1`
- Фильтрация пустых значений
- Пример: `"M1, m5, H1"` → `["M1", "M5", "H1"]`

## Отличия от Telegram Channels

| Параметр          | Telegram Channels                     | Symbols                |
| ----------------- | ------------------------------------- | ---------------------- |
| Обязательные поля | `title`                               | `symbol`               |
| Типы enum         | `status`, `source`, `signalsFormat`   | `instrumentType`       |
| Массивы           | `markets`, `tags`                     | `timeframes`           |
| Числовые поля     | `membersCount`, `price`, `winratePct` | нет                    |
| Нормализация      | username (удаление @)                 | timeframes (uppercase) |

## Стили

Обновлен файл `page.module.scss`:

```scss
.headerRow {
	@apply flex justify-between items-start mb-6 gap-4;
	flex-wrap: wrap;
}

.buttonSecondary {
	@apply px-4 py-2 border border-gray-300 rounded-lg bg-white;

	&:hover {
		@apply bg-gray-100 border-gray-400;
	}
}
```

## Пример Excel файла

### Sheet 1: Spot Symbols

| Symbol  | BaseAsset | QuoteAsset | InstrumentType | Exchange | Status | Timeframes         |
| ------- | --------- | ---------- | -------------- | -------- | ------ | ------------------ |
| BTCUSDT | BTC       | USDT       | SPOT           | Binance  | active | M1,M5,M15,H1,H4,D1 |
| ETHUSDT | ETH       | USDT       | SPOT           | Binance  | active | M5,M15,H1,D1       |
| BNBUSDT | BNB       | USDT       | SPOT           | Binance  | active | M5,H1,D1           |

### Sheet 2: Futures

| Symbol | BaseAsset | QuoteAsset | InstrumentType | Exchange | Status | Timeframes |
| ------ | --------- | ---------- | -------------- | -------- | ------ | ---------- |
| BTCUSD | BTC       | USD        | FUTURES        | Bybit    | active | M1,M5,H1   |
| ETHUSD | ETH       | USD        | FUTURES        | Bybit    | active | M5,H1,D1   |

## Обработка ошибок

### Типы ошибок

1. **Валидация файла:**

   - Неверный формат (не .xlsx/.xls)
   - Файл слишком большой (>10MB)

2. **Валидация данных:**

   - Пустое обязательное поле `Symbol`
   - Неверный формат `InstrumentType`
   - Ошибки схемы Zod

3. **Серверные ошибки:**
   - Дубликаты символов
   - Ошибки базы данных
   - Ошибки Redis синхронизации

### Формат ошибок

```typescript
{
  importedCount: 45,
  errorCount: 5,
  errors: [
    { row: 12, message: "Symbol already exists" },
    { row: 23, message: "Invalid InstrumentType" },
    { row: 34, message: "Missing required field: symbol" }
  ]
}
```

## TODO / Будущие улучшения

- [ ] Скачивание Excel шаблона (кнопка в UI)
- [ ] Preview данных перед импортом
- [ ] Batch импорт (разбивка на чанки)
- [ ] Поддержка CSV формата
- [ ] Экспорт текущих символов в Excel
- [ ] История импортов
- [ ] Rollback после ошибочного импорта

## Troubleshooting

### Ошибка: "Файл должен быть в формате Excel"

**Решение:** Используйте файлы с расширением `.xlsx` или `.xls`

### Ошибка: "В выбранных листах нет данных"

**Решение:**

- Убедитесь, что выбранные листы не пустые
- Проверьте, что первая строка содержит заголовки колонок
- Убедитесь, что есть хотя бы одна строка с данными

### Ошибка: "Missing required field: symbol"

**Решение:**

- Убедитесь, что колонка `Symbol` присутствует в Excel
- Проверьте, что в колонке `Symbol` нет пустых значений
- Используйте название `Symbol` (с заглавной буквы) или `symbol`

### Импорт завершается, но символы не появляются

**Решение:**

- Проверьте блок "Ошибки" под progress bar
- Обновите страницу (refetch списка)
- Проверьте консоль браузера на наличие ошибок

### Долгий импорт большого файла

**Рекомендации:**

- Разбейте файл на несколько листов по ~200 строк
- Импортируйте листы по отдельности
- Проверяйте progress bar для отслеживания прогресса

## Changelog

### v1.0.0 (Текущая версия)

- ✅ Создан компонент `SymbolsExcelUploader`
- ✅ Обновлена страница `symbols-to-redis/page.tsx`
- ✅ Добавлены стили для переключения режимов
- ✅ Интеграция с существующими API endpoints
- ✅ Валидация на клиенте (Zod)
- ✅ Поддержка множественных листов
- ✅ Детальное отображение ошибок
- ✅ Progress bar и статус импорта
