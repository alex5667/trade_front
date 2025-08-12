import { TypeRootState } from '@/store/store'

export const selectTelegramSignals = (state: TypeRootState) => state.telegram?.signals || []
export const selectTelegramLastUpdated = (state: TypeRootState) => state.telegram?.lastUpdated || null 