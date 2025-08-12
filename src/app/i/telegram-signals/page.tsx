'use client'

import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import tableStyles from '@/components/signal-table/volume-spike-table/VolumeSpikeTable.module.scss'

import { selectTelegramSignals } from '@/store/signals/selectors/telegram.selectors'

import { useGetTelegramSignalsQuery } from '@/services/telegram.api'

export default function TelegramSignalsPage() {
	const today = dayjs().format('YYYY-MM-DD')
	const { data, isLoading, isError, refetch } = useGetTelegramSignalsQuery(
		{ date: today },
		{
			pollingInterval: 30_000,
			refetchOnFocus: true,
			refetchOnReconnect: true
		}
	)

	const signalsFromStore = useSelector(selectTelegramSignals)
	const signals = useMemo(
		() =>
			signalsFromStore?.length
				? signalsFromStore
				: Array.isArray(data)
					? data
					: data?.signals || [],
		[signalsFromStore, data]
	)
	const hasData = signals.length > 0

	const preferredOrder = [
		'time',
		'timestamp',
		'date',
		'channel',
		'source',
		'username',
		'chatId',
		'chatTitle',
		'symbol',
		'ticker',
		'direction',
		'price',
		'entry',
		'stop',
		'take',
		'tp',
		'takeProfit',
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
		'timeframe',
		'exchange',
		'chatId',
		'chatTitle',
		'confidence',
		'receivedAt',
		'createdAt',
		'msgId'
	])

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
	}, [signals, hasData, preferredOrder])

	const isTimeLikeKey = (key: string) =>
		[
			'time',
			'timestamp',
			'createdAt',
			'updatedAt',
			'date',
			'receivedAt'
		].includes(key)
	const formatCell = (key: string, value: any) => {
		if (value === null || value === undefined) return '-'
		// Pretty-print 'tp' as JSON
		if (key === 'tp') {
			try {
				let data = value
				if (typeof value === 'string') {
					const trimmed = value.trim()
					if (!trimmed) return '-'
					// Try parse JSON-like strings
					if (
						(trimmed.startsWith('[') && trimmed.endsWith(']')) ||
						(trimmed.startsWith('{') && trimmed.endsWith('}'))
					) {
						data = JSON.parse(trimmed)
					}
				}
				// Show empty arrays/objects explicitly
				const isEmptyArray = Array.isArray(data) && data.length === 0
				const isEmptyObject =
					typeof data === 'object' &&
					!Array.isArray(data) &&
					data &&
					Object.keys(data).length === 0
				const pretty = JSON.stringify(data, null, 2)
				return (
					<pre className='whitespace-pre text-xs font-mono max-h-40 overflow-auto p-2 bg-gray-100 text-gray-800 rounded'>
						{isEmptyArray ? '[]' : isEmptyObject ? '{}' : pretty}
					</pre>
				)
			} catch {
				return String(value)
			}
		}
		// Render arrays as comma-separated values
		if (Array.isArray(value)) {
			if (value.length === 0) return '-'
			const parts = value
				.map(v => {
					if (v === null || v === undefined) return ''
					if (typeof v === 'number') return String(v)
					if (typeof v === 'string') return v
					try {
						return JSON.stringify(v)
					} catch {
						return String(v)
					}
				})
				.filter(Boolean)
			return parts.length ? parts.join(', ') : '-'
		}
		if (isTimeLikeKey(key)) {
			const ms = typeof value === 'number' ? value : Date.parse(String(value))
			if (!Number.isNaN(ms)) return new Date(ms).toLocaleTimeString()
		}
		if (typeof value === 'object') {
			try {
				const json = JSON.stringify(value)
				return json.length > 200 ? json.slice(0, 200) + '…' : json
			} catch {
				return String(value)
			}
		}
		if (typeof value === 'boolean') return value ? 'true' : 'false'
		return String(value)
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
			<p className='text-xs text-gray-500 mb-2'>Date: {today}</p>
			<div className={tableStyles.tableWrapper}>
				<table className={tableStyles.table}>
					<thead>
						<tr className={tableStyles.headRow}>
							<th className={tableStyles.cell}></th>
							{columns.map(col => (
								<th
									key={col}
									className={tableStyles.cell}
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td
									colSpan={columns.length + 1}
									className={tableStyles.emptyCell}
								>
									Загрузка...
								</td>
							</tr>
						) : isError ? (
							<tr>
								<td
									colSpan={columns.length + 1}
									className={tableStyles.emptyCell}
								>
									Ошибка загрузки.{' '}
									<button
										className='underline'
										onClick={() => refetch()}
									>
										Повторить
									</button>
								</td>
							</tr>
						) : hasData ? (
							signals.map((s: any, idx: number) => {
								const rowKey = s?.messageId ?? s?.id ?? idx
								return (
									<tr
										key={rowKey}
										className={tableStyles.row}
									>
										<td className={tableStyles.cell}>
											<button
												onClick={ev => openModal(s, ev)}
												className='px-2 py-1 border rounded'
												aria-label='Подробнее'
												title='Развернуть'
											>
												+
											</button>
										</td>
										{columns.map(col => (
											<td
												key={col}
												className={tableStyles.cell}
											>
												{formatCell(col, s?.[col])}
											</td>
										))}
									</tr>
								)
							})
						) : (
							<tr>
								<td
									colSpan={columns.length + 1}
									className={tableStyles.emptyCell}
								>
									Нет сигналов за сегодня
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{modalOpen && anchorPos && (
				<>
					{/* click-catcher to close when clicking outside */}
					<button
						className='fixed inset-0 z-40 cursor-default'
						aria-label='overlay'
						onClick={closeModal}
					></button>
					<div
						role='dialog'
						aria-modal='true'
						className='fixed z-50 rounded shadow-lg border border-gray-700 bg-gray-900 text-white p-4 w-[320px]'
						style={{ top: anchorPos.top, left: anchorPos.left }}
					>
						<button
							onClick={closeModal}
							className='absolute right-2 top-2 text-gray-300 hover:text-white'
							aria-label='Закрыть'
						>
							×
						</button>
						<h2 className='text-sm font-semibold mb-2'>Подробнее</h2>
						<div className='grid grid-cols-1 gap-1 text-sm'>
							<div>
								<span className='text-gray-400'>chatId:</span>{' '}
								{formatCell('chatId', modalData?.chatId)}
							</div>
							<div>
								<span className='text-gray-400'>chatTitle:</span>{' '}
								{formatCell('chatTitle', modalData?.chatTitle)}
							</div>
							<div>
								<span className='text-gray-400'>confidence:</span>{' '}
								{formatCell('confidence', modalData?.confidence)}
							</div>
							<div>
								<span className='text-gray-400'>receivedAt:</span>{' '}
								{formatCell('receivedAt', modalData?.receivedAt)}
							</div>
							<div>
								<span className='text-gray-400'>createdAt:</span>{' '}
								{formatCell('createdAt', modalData?.createdAt)}
							</div>
							<div>
								<span className='text-gray-400'>msgId:</span>{' '}
								{formatCell('msgId', modalData?.msgId ?? modalData?.messageId)}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
