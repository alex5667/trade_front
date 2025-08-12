'use client'

import dayjs from 'dayjs'
import { useMemo } from 'react'
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
		'symbol',
		'ticker',
		'direction',
		'timeframe',
		'exchange',
		'price',
		'entry',
		'stop',
		'take',
		'takeProfit',
		'message',
		'text',
		'link',
		'url',
		'messageId',
		'id'
	]

	const columns = useMemo(() => {
		if (!hasData) return ['time', 'channel', 'symbol', 'message']
		const keySet = new Set<string>()
		for (const s of signals) {
			Object.keys(s || {}).forEach(k => keySet.add(k))
		}
		const allKeys = Array.from(keySet)
		const orderedPreferred = preferredOrder.filter(k => keySet.has(k))
		const remaining = allKeys
			.filter(k => !orderedPreferred.includes(k))
			.sort((a, b) => a.localeCompare(b))
		return [...orderedPreferred, ...remaining]
	}, [signals, hasData])

	const isTimeLikeKey = (key: string) =>
		['time', 'timestamp', 'createdAt', 'updatedAt', 'date'].includes(key)
	const formatCell = (key: string, value: any) => {
		if (value === null || value === undefined) return '-'
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

	return (
		<div className='p-4'>
			<h1 className='text-lg font-semibold mb-1'>Telegram Signals</h1>
			<p className='text-xs text-gray-500 mb-2'>Date: {today}</p>
			<div className={tableStyles.tableWrapper}>
				<table className={tableStyles.table}>
					<thead>
						<tr className={tableStyles.headRow}>
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
									colSpan={columns.length}
									className={tableStyles.emptyCell}
								>
									Загрузка...
								</td>
							</tr>
						) : isError ? (
							<tr>
								<td
									colSpan={columns.length}
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
							signals.map((s: any, idx: number) => (
								<tr
									key={idx}
									className={tableStyles.row}
								>
									{columns.map(col => (
										<td
											key={col}
											className={tableStyles.cell}
										>
											{formatCell(col, s?.[col])}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className={tableStyles.emptyCell}
								>
									Нет сигналов за сегодня
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
