import { TypeRootState } from '@/store/store'

export const selectTelegramChannels = (state: TypeRootState) => state.telegramChannels?.channels ?? []
export const selectTelegramChannelsLastUpdated = (state: TypeRootState) => state.telegramChannels?.lastUpdated ?? null 