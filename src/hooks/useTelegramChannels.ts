import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { SearchFilters } from '@/components/telegram/channel/TelegramChannelSearch'
import {
	useCreateTelegramChannelMutation,
	useDeleteTelegramChannelMutation,
	useGetTelegramChannelsQuery,
	useUpdateTelegramChannelMutation
} from '@/services/telegramChannel.api'
import { selectTelegramChannels } from '@/store/signals/selectors/telegramChannels.selectors'

export const useTelegramChannels = () => {
	const [searchFilters, setSearchFilters] = useState<SearchFilters>({})
	const [refreshKey, setRefreshKey] = useState(0)

	// Определяем, есть ли активные фильтры
	const hasActiveFilters = Object.values(searchFilters).some(value => value && value.trim() !== '')

	// Передаем параметры только если есть активные фильтры, иначе undefined для загрузки всех
	const queryParams = hasActiveFilters ? { ...searchFilters, _refresh: refreshKey } : undefined

	const { data, isLoading, isError, refetch } = useGetTelegramChannelsQuery(queryParams)
	const [createChannel, createMeta] = useCreateTelegramChannelMutation()
	const [updateChannel, updateMeta] = useUpdateTelegramChannelMutation()
	const [deleteChannel, deleteMeta] = useDeleteTelegramChannelMutation()

	const channelsFromStore = useSelector(selectTelegramChannels)

	const channels = useMemo(() => {
		if (Array.isArray(channelsFromStore) && channelsFromStore.length) return channelsFromStore
		if (!data) return []
		// @ts-ignore
		return data.data || []
	}, [channelsFromStore, data])

	// Принудительно загружаем данные при первом рендере, если их нет
	useEffect(() => {
		if (!hasActiveFilters && !data && !isLoading && !channelsFromStore.length) {
			refetch()
		}
	}, [hasActiveFilters, data, isLoading, channelsFromStore.length, refetch])

	const handleSearch = (filters: SearchFilters) => {
		setSearchFilters(filters)
		// Увеличиваем ключ обновления для принудительного обновления
		setRefreshKey(prev => prev + 1)
	}

	const handleClearSearch = () => {
		// Сначала очищаем фильтры
		setSearchFilters({})
		// Увеличиваем ключ обновления для принудительного обновления
		setRefreshKey(prev => prev + 1)
		// Затем принудительно обновляем данные для загрузки всех каналов
		// Используем setTimeout чтобы дать React время обновить состояние
		setTimeout(() => {
			refetch()
		}, 0)
	}

	return {
		channels,
		isLoading,
		isError,
		refetch,
		createChannel,
		isCreating: createMeta.isLoading,
		updateChannel,
		isUpdating: updateMeta.isLoading,
		deleteChannel,
		isDeleting: deleteMeta.isLoading,
		searchFilters,
		hasActiveFilters,
		handleSearch,
		handleClearSearch
	}
} 