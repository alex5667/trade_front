import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
	useCreateTelegramChannelMutation,
	useDeleteTelegramChannelMutation,
	useGetTelegramChannelsQuery,
	useUpdateTelegramChannelMutation
} from '@/services/telegramChannel.api'
import { selectTelegramChannels } from '@/store/signals/selectors/telegramChannels.selectors'

export const useTelegramChannels = () => {
	const { data, isLoading, isError, refetch } = useGetTelegramChannelsQuery()
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
		isDeleting: deleteMeta.isLoading
	}
} 