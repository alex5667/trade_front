export type SignalsFormat = 'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'MIXED' | string
export type ChannelStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'ARCHIVED' | string
export type Source = 'MANUAL' | 'AUTO' | 'IMPORT' | string

export interface TelegramChannel {
	id: string // cuid
	chatId?: string // represent BigInt as string to avoid precision issues in JS
	username?: string
	title: string
	link: string
	description?: string
	language?: string
	membersCount?: number
	isPaid: boolean
	price?: string // Decimal represented as string
	signalsFormat: SignalsFormat
	markets: string[]
	tags: string[]
	winratePct?: string // Decimal represented as string
	status: ChannelStatus
	source: Source
	lastPostAt?: string
	lastCheckedAt?: string
	createdAt: string
	updatedAt: string
	[key: string]: unknown
}

export type TelegramChannelUpsert = Partial<Omit<TelegramChannel, 'id' | 'createdAt' | 'updatedAt'>> 