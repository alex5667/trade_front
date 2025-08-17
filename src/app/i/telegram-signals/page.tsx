'use client'

import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { TelegramDateRangePicker } from '@/components/telegram/TelegramDateRangePicker'
import { TelegramDetailsPopover } from '@/components/telegram/TelegramDetailsPopover'
import { TelegramSignalsSearch } from '@/components/telegram/TelegramSignalsSearch'
import { TelegramSignalsTable } from '@/components/telegram/TelegramSignalsTable'

import { useTelegramSignals } from '@/hooks/useTelegramSignals'

export default function TelegramSignalsPage() {
	const today = dayjs().format('YYYY-MM-DD')
	const {
		range,
		setRange,
		rangeActive,
		signals,
		isLoading,
		isError,
		refetch,
		handleSearch,
		handleClearSearch
	} = useTelegramSignals()
	const hasData = signals.length > 0

	const preferredOrder = [
		'time',
		'timestamp',
		'date',
		'channel',
		'source',
		'username',
		'symbol',
		'ticker',
		'direction',
		'timeframe',
		'exchange',
		'price',
		'entry',
		'stop',
		'take',
		'tp',
		'takeProfit',
		'leverage',
		'riskPct',
		'tpPct',
		'message',
		'text',
		'link',
		'url',
		'messageId',
		'id',
		'confidence',
		'receivedAt',
		'createdAt',
		'msgId'
	]

	const hiddenMainColumns = new Set([
		'chatId',
		'chatTitle',
		'confidence',
		'receivedAt',
		'createdAt',
		'msgId'
	])

	// Маппинг для более понятных названий колонок
	const columnLabels: Record<string, string> = {
		time: 'Время',
		timestamp: 'Дата/Время',
		date: 'Дата',
		channel: 'Канал',
		source: 'Источник',
		username: 'Username',
		symbol: 'Символ',
		ticker: 'Тикер',
		direction: 'Направление',
		timeframe: 'Таймфрейм',
		exchange: 'Биржа',
		price: 'Цена',
		entry: 'Entry',
		stop: 'Stop Loss',
		take: 'Take Profit',
		tp: 'Take Profit',
		takeProfit: 'Take Profit',
		leverage: 'Плечо',
		riskPct: 'Риск %',
		tpPct: 'TP %',
		message: 'Сообщение',
		text: 'Текст',
		link: 'Ссылка',
		url: 'URL',
		membersCount: 'Участники'
	}

	const columns = useMemo(() => {
		if (!hasData) return ['time', 'channel', 'symbol', 'message']
		const keySet = new Set<string>()
		for (const s of signals) {
			Object.keys(s || {}).forEach(k => keySet.add(k))
		}
		const allKeys = Array.from(keySet)
		const orderedPreferred = preferredOrder.filter(
			k => keySet.has(k) && !hiddenMainColumns.has(k)
		)
		const remaining = allKeys
			.filter(k => !orderedPreferred.includes(k) && !hiddenMainColumns.has(k))
			.sort((a, b) => a.localeCompare(b))
		return [...orderedPreferred, ...remaining]
	}, [signals, hasData, preferredOrder, hiddenMainColumns])

	// Функция для получения отображаемого названия колонки
	const getColumnLabel = (column: string) => {
		return columnLabels[column] || column
	}

	const [modalOpen, setModalOpen] = useState(false)
	const [modalData, setModalData] = useState<any>(null)
	const [anchorPos, setAnchorPos] = useState<{
		top: number
		left: number
	} | null>(null)
	const openModal = (row: any, e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		setAnchorPos({
			top: rect.top + window.scrollY,
			left: rect.right + window.scrollX + 8
		})
		setModalData(row)
		setModalOpen(true)
	}
	const closeModal = () => {
		setModalOpen(false)
		setModalData(null)
		setAnchorPos(null)
	}

	return (
		<div className='p-4'>
			<h1 className='text-lg font-semibold mb-1'>Telegram Signals</h1>
			<p className='text-xs text-gray-500 mb-2'>
				Date: {rangeActive ? `${range.start} → ${range.end}` : today}
			</p>
			<TelegramDateRangePicker
				initialStart={range.start || today}
				initialEnd={range.end || today}
				onApply={(start, end) => setRange({ start, end })}
			/>
			<TelegramSignalsSearch
				onSearch={handleSearch}
				onClear={handleClearSearch}
			/>
			{modalOpen && modalData && anchorPos && (
				<TelegramDetailsPopover
					data={modalData}
					onClose={closeModal}
					anchor={anchorPos}
				/>
			)}
			<TelegramSignalsTable
				columns={columns}
				signals={signals}
				onOpenDetails={openModal}
				isLoading={isLoading}
				isError={isError}
				onRefetch={refetch}
				getColumnLabel={getColumnLabel}
			/>
		</div>
	)
}
