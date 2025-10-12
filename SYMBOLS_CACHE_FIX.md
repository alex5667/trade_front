# Исправление автоматического обновления таблицы символов

## Проблема

После создания символа на странице `/i/symbols-to-redis` требовалось обновлять страницу вручную, чтобы увидеть новый символ в таблице.

## Причина

1. Использовались устаревшие/общие теги кэша RTK Query (`['SymbolToRedis']`)
2. Присутствовали избыточные ручные вызовы `refetch()` в обработчиках
3. Недостаточно специфичная система тегов кэша для автоматической инвалидации

## Решение

### 1. Улучшена система тегов кэша в API (`src/services/symbol-to-redis.api.ts`)

#### Запросы (Queries) - используют `providesTags`:

- **getSymbols**: Предоставляет теги для каждого элемента + `LIST`

  ```typescript
  providesTags: result =>
  	result
  		? [
  				...result.data.map(({ id }) => ({
  					type: 'SymbolToRedis' as const,
  					id
  				})),
  				{ type: 'SymbolToRedis', id: 'LIST' }
  			]
  		: [{ type: 'SymbolToRedis', id: 'LIST' }]
  ```

- **Фильтры и поиск**: Используют тег `LIST`

  - `searchSymbols`
  - `getSymbolsByBaseAsset`
  - `getSymbolsByQuoteAsset`
  - `getSymbolsByInstrumentType`
  - `getSymbolsByTimeframe`

- **Статистика**: Использует тег `STATS`

  - `getStats`

- **Redis операции**: Используют тег `REDIS`
  - `getRedisSymbols`
  - `getRedisSymbolsByBaseAsset`
  - `getRedisSymbolsByQuoteAsset`
  - `getRedisSymbolsByInstrumentType`
  - `getRedisSymbolsByTimeframe`
  - `getRedisSymbolDetails`
  - `checkRedisSymbolExists`
  - `getRedisStats`

#### Мутации (Mutations) - используют `invalidatesTags`:

- **createSymbol**: Инвалидирует `LIST`

  ```typescript
  invalidatesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
  ```

- **updateSymbol**: Инвалидирует конкретный элемент + `LIST`

  ```typescript
  invalidatesTags: (result, error, { id }) => [
  	{ type: 'SymbolToRedis', id },
  	{ type: 'SymbolToRedis', id: 'LIST' }
  ]
  ```

- **deleteSymbol**: Инвалидирует конкретный элемент + `LIST`

  ```typescript
  invalidatesTags: (result, error, id) => [
  	{ type: 'SymbolToRedis', id },
  	{ type: 'SymbolToRedis', id: 'LIST' }
  ]
  ```

- **bulkCreateSymbols**: Инвалидирует `LIST`

  ```typescript
  invalidatesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
  ```

- **uploadExcelData**: Инвалидирует `LIST`

  ```typescript
  invalidatesTags: [{ type: 'SymbolToRedis', id: 'LIST' }]
  ```

- **clearRedisData**: Инвалидирует `LIST` и `REDIS`
  ```typescript
  invalidatesTags: [
  	{ type: 'SymbolToRedis', id: 'LIST' },
  	{ type: 'SymbolToRedis', id: 'REDIS' }
  ]
  ```

### 2. Удалены избыточные вызовы refetch() (`src/app/i/symbols-to-redis/page.tsx`)

Удалены ручные вызовы `refetch()` из обработчиков:

- `handleCreate` - создание символа
- `handleUpdate` - обновление символа
- `handleDelete` - удаление символа

RTK Query теперь автоматически обновляет кэш благодаря правильно настроенным тегам.

**Примечание**: Вызов `refetch()` оставлен только в обработчике ошибок для ручного повтора запроса.

## Преимущества нового подхода

1. **Автоматическое обновление**: Таблица обновляется автоматически после любой операции (создание, обновление, удаление)
2. **Оптимизированные запросы**: RTK Query делает минимум необходимых запросов
3. **Лучшая производительность**: Используется встроенный механизм кэширования
4. **Чистый код**: Меньше дублирования и ручного управления состоянием
5. **Масштабируемость**: Легко добавлять новые операции с автоматическим обновлением

## Как это работает

1. **При создании символа**:

   - Вызывается мутация `createSymbol`
   - Мутация инвалидирует тег `{ type: 'SymbolToRedis', id: 'LIST' }`
   - RTK Query автоматически перезапрашивает все запросы с этим тегом
   - Таблица обновляется с новыми данными

2. **При обновлении символа**:

   - Инвалидируются теги конкретного элемента и `LIST`
   - Обновляются все связанные запросы

3. **При удалении символа**:
   - Аналогично обновлению, инвалидируются оба тега
   - Элемент исчезает из всех списков

## Тестирование

Проверьте следующие сценарии:

1. ✅ Создание нового символа - должен появиться в таблице без перезагрузки
2. ✅ Редактирование символа - изменения должны отразиться немедленно
3. ✅ Удаление символа - должен исчезнуть из таблицы без перезагрузки
4. ✅ Массовая загрузка из Excel - таблица обновляется автоматически
5. ✅ Счетчики статистики обновляются корректно

## Дополнительные улучшения

Если потребуется еще более точный контроль, можно добавить:

- Оптимистичные обновления (optimistic updates)
- Кэширование с временем жизни (TTL)
- Подписки на обновления через WebSocket
