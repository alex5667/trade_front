/**
 * Типы для модуля SymbolToRedis
 * Соответствуют интерфейсам из backend
 */

// Тип для таймфреймов
export type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1' | 'H4' | 'H6' | 'H8' | 'H12' | 'D1' | 'D3' | 'W1' | 'MN1'

// Тип для типа инструмента
export type InstrumentType = 'SPOT' | 'FUTURES' | 'FOREX' | 'METAL' | 'INDEX' | 'CRYPTO_INDEX' | 'OTHER'

// Интерфейс для связи символа с таймфреймом
export interface SymbolTimeframe {
	id: string
	symbolId: string
	timeframe: Timeframe
	isActive: boolean
	createdAt: Date
	updatedAt: Date
}

// Основной интерфейс для SymbolToRedis
export interface SymbolToRedis {
	id: string
	baseAsset: string
	quoteAsset: string
	symbol: string
	instrumentType: InstrumentType
	exchange: string
	status?: string | null
	note?: string | null
	createdAt: Date
	updatedAt: Date
	timeframes: string[]
}

// DTO для создания символа
export interface CreateSymbolToRedisDto {
	symbol: string
	baseAsset?: string
	quoteAsset?: string
	instrumentType?: InstrumentType
	timeframes?: string[]
	exchange?: string
	status?: string
	note?: string
}

// DTO для обновления символа
export interface UpdateSymbolToRedisDto extends Partial<CreateSymbolToRedisDto> { }

// Фильтры для поиска
export interface SymbolToRedisFilters {
	symbol?: string
	baseAsset?: string
	quoteAsset?: string
	instrumentType?: InstrumentType
	timeframes?: string[]
	exchange?: string
	status?: string
	note?: string
}

// Опции пагинации
export interface PaginationOptions {
	limit?: number
	offset?: number
}

// Опции сортировки
export interface SortOptions {
	field?: string
	direction?: 'asc' | 'desc'
}

// Запрос для получения символов
export interface GetSymbolsToRedisQuery extends SymbolToRedisFilters, PaginationOptions, SortOptions { }

// Пагинированный ответ
export interface PaginatedSymbolsToRedisResponse {
	data: SymbolToRedis[]
	total: number
	limit: number
	offset: number
	totalPages: number
	currentPage: number
}

// Результат поиска
export interface SymbolSearchResult {
	symbol: SymbolToRedis
	matchType: 'exact' | 'case_insensitive' | 'normalized' | 'partial'
	originalQuery: string
	normalizedSymbol: string
}

// Статистика символов
export interface SymbolToRedisStats {
	totalCount: number
	countByType: Record<string, number>
	countByExchange: Record<string, number>
	countByStatus: Record<string, number>
	countByBaseAsset: Record<string, number>
	countByQuoteAsset: Record<string, number>
	countByTimeframe: Record<string, number>
}

// Нормализация символа
export interface SymbolNormalization {
	symbol: string
	baseAsset: string
	quoteAsset: string
	instrumentType: InstrumentType
	normalizationType: 'case_conversion' | 'typo_correction' | 'separator_removal'
}

// Массовое создание символов
export interface BulkCreateSymbolsDto {
	symbols: string[]
	timeframes?: string[]
	exchange?: string
	status?: string
	note?: string
}

// Константы
export const TIMEFRAMES: Timeframe[] = [
	'M1', 'M5', 'M15', 'M30',
	'H1', 'H4', 'H6', 'H8', 'H12',
	'D1', 'D3',
	'W1',
	'MN1'
]

// Таймфреймы по умолчанию для новых символов
export const DEFAULT_TIMEFRAMES: Timeframe[] = [
	'M1', 'M5', 'M15',
	'H1', 'H4',
	'D1',
	'W1'
]

export const INSTRUMENT_TYPES: InstrumentType[] = [
	'SPOT', 'FUTURES', 'FOREX', 'METAL', 'INDEX', 'CRYPTO_INDEX', 'OTHER'
] 