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
	timeframes?: SymbolTimeframe[]
}

// DTO для создания символа
export interface CreateSymbolToRedisDto {
	symbol: string
	baseAsset?: string
	quoteAsset?: string
	instrumentType?: InstrumentType
	timeframes?: Timeframe[]
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
	timeframe?: Timeframe
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
	matchType: 'exact' | 'partial' | 'fuzzy'
	score: number
}

// Статистика символов
export interface SymbolToRedisStats {
	totalSymbols: number
	totalTimeframes: number
	byInstrumentType: Record<InstrumentType, number>
	byExchange: Record<string, number>
	byBaseAsset: Record<string, number>
	byQuoteAsset: Record<string, number>
	byTimeframe: Record<Timeframe, number>
}

// Нормализация символа
export interface SymbolNormalization {
	original: string
	normalized: string
	baseAsset: string
	quoteAsset: string
	instrumentType: InstrumentType
	confidence: number
	suggestions: string[]
}

// Массовое создание символов
export interface BulkCreateSymbolsDto {
	symbols: CreateSymbolToRedisDto[]
	skipDuplicates?: boolean
	validateOnly?: boolean
}

// Константы
export const TIMEFRAMES: Timeframe[] = [
	'M1', 'M5', 'M15', 'M30',
	'H1', 'H4', 'H6', 'H8', 'H12',
	'D1', 'D3',
	'W1',
	'MN1'
]

export const INSTRUMENT_TYPES: InstrumentType[] = [
	'SPOT', 'FUTURES', 'FOREX', 'METAL', 'INDEX', 'CRYPTO_INDEX', 'OTHER'
] 