export type SignalsFormat = 'NONE' | 'ENTRY_SL_TP' | 'ANALYTICS' | 'BOTH'
export type ChannelStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
export type Source = 'MANUAL' | 'SCRAPED' | 'IMPORTED'

export interface TelegramChannel {
	id: string
	chatId?: string
	username?: string
	title: string
	link?: string
	description?: string
	language?: string
	membersCount?: number
	isPaid: boolean
	price?: string
	signalsFormat: SignalsFormat
	markets: string[]
	tags: string[]
	winratePct?: string
	status: ChannelStatus
	source: Source
	lastPostAt?: string
	lastCheckedAt?: string
	createdAt: string
	updatedAt: string
	[key: string]: unknown
}

export type TelegramChannelUpsert = Partial<Omit<TelegramChannel, 'id' | 'createdAt' | 'updatedAt'>>

// Parsed telegram signal as in trade_back model TelegramParsedSignal
export interface TelegramParsedSignal {
	id?: string
	chatId?: string
	chatTitle?: string
	username?: string
	msgId?: string
	// legacy aliases for compatibility
	messageId?: string | number
	timestamp?: string
	receivedAt: string
	createdAt: string
	// parsed content
	symbol?: string
	direction?: string
	entry?: string
	stop?: string
	tp?: unknown
	tpPct?: unknown
	leverage?: number
	timeframe?: string
	exchange?: string
	riskPct?: string
	confidence?: string
	updatedAt?: string
	[key: string]: unknown
}

export type TelegramParsedSignalQuery = {
	start: string
	end: string
	limit?: number
	offset?: number
	symbol?: string
	direction?: string
	timeframe?: string
	exchange?: string
	username?: string
	chatId?: string
} 