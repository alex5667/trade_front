'use client'

import { useState } from 'react'

import ChannelsExcelUploader from '@/components/telegram/channel/ChannelsExcelUploader'
import { TelegramChannelForm } from '@/components/telegram/channel/TelegramChannelForm'
import { TelegramChannelList } from '@/components/telegram/channel/TelegramChannelList'
import { TelegramChannelSearch } from '@/components/telegram/channel/TelegramChannelSearch'

import { useTelegramChannels } from '@/hooks/useTelegramChannels'

import styles from './TelegramChannel.module.scss'
import type { CreateTelegramChannelDto } from '@/services/telegramChannel.api'

export default function TelegramChannelPage() {
	const [showExcelUploader, setShowExcelUploader] = useState(false)

	const {
		channels,
		isLoading,
		isError,
		refetch,
		createChannel,
		isCreating,
		updateChannel,
		isDeleting,
		deleteChannel,
		isUpdating,
		handleSearch,
		handleClearSearch
	} = useTelegramChannels()

	const handleCreate = async (data: CreateTelegramChannelDto) => {
		await createChannel(data).unwrap()
	}
	const handleSave = async (id: string | number, data: Record<string, any>) => {
		await updateChannel({ id, data }).unwrap()
	}
	const handleDelete = async (id: string | number) => {
		await deleteChannel(id).unwrap()
	}

	if (showExcelUploader) {
		return (
			<div className={styles.container}>
				<div className={styles.headerRow}>
					<h1 className={styles.header}>Загрузка каналов из Excel</h1>
					<button
						onClick={() => setShowExcelUploader(false)}
						className={styles.buttonSecondary}
					>
						← Назад к списку
					</button>
				</div>
				<ChannelsExcelUploader />
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.headerRow}>
				<h1 className={styles.header}>Telegram Channels</h1>
				<button
					onClick={() => setShowExcelUploader(true)}
					className={styles.buttonSecondary}
				>
					📊 Загрузить из Excel
				</button>
			</div>
			<TelegramChannelForm
				onCreate={handleCreate}
				className={styles.form}
				buttonClass={styles.buttonPrimary}
				labelClass={styles.fieldLabel}
			/>
			<TelegramChannelSearch
				onSearch={handleSearch}
				onClear={handleClearSearch}
			/>
			{isLoading ? (
				<p>Загрузка...</p>
			) : isError ? (
				<p>
					Ошибка загрузки.{' '}
					<button
						className={styles.button}
						onClick={() => refetch()}
					>
						Повторить
					</button>
				</p>
			) : (
				<TelegramChannelList
					channels={channels}
					onSave={handleSave}
					onDelete={handleDelete}
					isSaving={isUpdating}
					isDeleting={isDeleting}
				/>
			)}
		</div>
	)
}
