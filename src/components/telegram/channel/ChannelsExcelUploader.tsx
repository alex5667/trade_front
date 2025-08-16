'use client'

import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'

const RowSchema = z.object({
	title: z.string().min(1),
	username: z
		.string()
		.optional()
		.transform(v => v?.replace(/^@/, '')),
	link: z.string().url().optional(),
	description: z.string().optional(),
	language: z.string().optional(),
	members: z.number().optional(),
	price: z.number().optional(),
	signalsFormat: z.enum(['NONE', 'CSV', 'JSON']).optional(),
	markets: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	winrate: z.number().optional(),
	status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
	source: z.enum(['MANUAL', 'AUTO', 'IMPORT']).optional()
})

type RowDTO = z.infer<typeof RowSchema>

const BATCH_SIZE = 200

function normalizeStatus(v?: string) {
	if (!v) return undefined
	const s = v.trim().toLowerCase()
	if (['active', 'enabled', 'live'].includes(s)) return 'ACTIVE'
	if (['inactive', 'disabled', 'off'].includes(s)) return 'INACTIVE'
	if (['suspended', 'blocked', 'banned'].includes(s)) return 'SUSPENDED'
	return (v[0]?.toUpperCase() ?? '') + v.slice(1)
}

function normalizeSource(v?: string) {
	if (!v) return undefined
	const s = v.trim().toLowerCase()
	if (['manual', 'hand', 'user'].includes(s)) return 'MANUAL'
	if (['auto', 'automatic', 'bot'].includes(s)) return 'AUTO'
	if (['import', 'excel', 'csv'].includes(s)) return 'IMPORT'
	return (v[0]?.toUpperCase() ?? '') + v.slice(1)
}

function parseArray(v?: string) {
	if (!v) return []
	return v
		.split(/[,;/]|(?=\s#)/g)
		.map(s => s.replace(/[#\s]+/g, '').trim())
		.filter(Boolean)
}

function toNumberSafe(v: unknown) {
	if (v == null || v === '') return undefined
	const num = Number(String(v).replace('%', '').trim())
	return Number.isFinite(num) ? num : undefined
}

type SheetMeta = { name: string; rows: number; totalRows: number }

export default function ChannelsExcelUploader({
	apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/channels/bulk'
}: {
	apiUrl?: string
}) {
	const [status, setStatus] = useState<string>('')
	const [progress, setProgress] = useState<number>(0)
	const [errors, setErrors] = useState<string[]>([])

	const [wb, setWb] = useState<XLSX.WorkBook | null>(null)
	const [sheetNames, setSheetNames] = useState<string[]>([])
	const [selectedSheets, setSelectedSheets] = useState<string[]>([])
	const [sheetInfo, setSheetMeta] = useState<SheetMeta[]>([])

	const totalSelectedRows = useMemo(() => {
		const map = Object.fromEntries(sheetInfo.map(s => [s.name, s.rows]))
		return selectedSheets.reduce((sum, s) => sum + (map[s] ?? 0), 0)
	}, [selectedSheets, sheetInfo])

	async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file) return
		setErrors([])
		setProgress(0)
		setStatus('Читаю файл…')
		setWb(null)
		setSheetNames([])
		setSelectedSheets([])
		setSheetMeta([])

		const buf = await file.arrayBuffer()
		const book = XLSX.read(buf, { type: 'array' })
		setWb(book)
		setSheetNames(book.SheetNames)

		// более детальный подсчёт строк по листам
		const info: SheetMeta[] = book.SheetNames.map(n => {
			const ws = book.Sheets[n]

			// Получаем диапазон данных
			const range = ws['!ref']
				? XLSX.utils.decode_range(ws['!ref'])
				: { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }
			const totalRows = range.e.r + 1 // +1 потому что range начинается с 0

			// Читаем все строки для подсчета непустых
			const json = XLSX.utils.sheet_to_json(ws, {
				defval: '',
				raw: false
			})

			// Фильтруем строки, где есть хотя бы одно непустое значение
			const nonEmptyRows = json.filter(row =>
				Object.values(row as Record<string, any>).some(
					value =>
						value !== null && value !== undefined && String(value).trim() !== ''
				)
			)

			return {
				name: n,
				rows: nonEmptyRows.length,
				totalRows: totalRows
			}
		})
		setSheetMeta(info)
		// Автоматически выбираем все листы
		setSelectedSheets(book.SheetNames)
		setStatus(
			`Найдено листов: ${book.SheetNames.length}. Все листы выбраны автоматически. Нажмите "Импортировать".`
		)
	}

	function toggleSheet(name: string) {
		setSelectedSheets(prev =>
			prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
		)
	}

	async function handleImport() {
		if (!wb) return
		if (selectedSheets.length === 0) {
			setErrors(['Не выбран ни один лист.'])
			return
		}
		setErrors([])
		setProgress(0)
		setStatus('Нормализую данные…')

		// объединяем все выбранные листы
		const rawRows: Record<string, any>[] = selectedSheets.flatMap(sheet => {
			const ws = wb.Sheets[sheet]

			// Читаем с заголовками для правильного маппинга колонок
			const json = XLSX.utils.sheet_to_json(ws, {
				defval: '',
				raw: false
			}) as Record<string, any>[]

			// Фильтруем строки, где есть хотя бы одно непустое значение
			return json.filter(row =>
				Object.values(row).some(
					value =>
						value !== null && value !== undefined && String(value).trim() !== ''
				)
			)
		})

		if (rawRows.length === 0) {
			setErrors(['В выбранных листах нет данных.'])
			setStatus('Готово (пусто)')
			return
		}

		const mapped: RowDTO[] = []
		try {
			rawRows.forEach((r, idx) => {
				const dto: RowDTO = {
					title: String(r['Title'] ?? r['Name'] ?? '').trim(),
					username: String(r['Username'] ?? r['Telegram_Handle'] ?? '').trim(),
					link:
						String(r['Link'] ?? r['Telegram_URL'] ?? '').trim() || undefined,
					description:
						String(r['Description'] ?? r['Summary'] ?? '').trim() || undefined,
					language: String(r['Language'] ?? '').trim() || undefined,
					members: toNumberSafe(r['Members']),
					price: toNumberSafe(r['Price']),
					signalsFormat: String(
						r['Signals_Format'] ?? 'NONE'
					).toUpperCase() as any,
					markets: parseArray(String(r['Markets'] ?? r['Assets'] ?? '')),
					tags: parseArray(String(r['Tags'] ?? '')),
					winrate: toNumberSafe(r['Winrate'] ?? r['Claimed_Winrate']),
					status: normalizeStatus(String(r['Status'] ?? 'ACTIVE')) as any,
					source: normalizeSource(String(r['Source'] ?? 'IMPORT')) as any
				}
				const res = RowSchema.safeParse(dto)
				if (!res.success) {
					throw new Error(
						`Строка ${idx + 2}: ${res.error.issues
							.map((e: any) => `${e.path.join('.')}: ${e.message}`)
							.join('; ')}`
					)
				}
				mapped.push(res.data)
			})
		} catch (e: any) {
			setErrors([e.message ?? String(e)])
			setStatus('Ошибка валидации')
			return
		}

		setStatus('Отправляю на бэкенд…')
		let sent = 0
		const localErrors: string[] = []

		for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
			const chunk = mapped.slice(i, i + BATCH_SIZE)
			try {
				const resp = await fetch(apiUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ items: chunk })
				})
				if (!resp.ok) {
					const txt = await resp.text().catch(() => '')
					throw new Error(`HTTP ${resp.status} ${txt}`)
				}
			} catch (err: any) {
				localErrors.push(
					`Батч ${i / BATCH_SIZE + 1}: ${err.message ?? String(err)}`
				)
			}
			sent += chunk.length
			setProgress(Math.round((sent / mapped.length) * 100))
		}

		setErrors(localErrors)
		setStatus(localErrors.length ? 'Завершено с ошибками' : 'Готово ✅')
	}

	return (
		<div className='space-y-4 p-4 border rounded-xl bg-white shadow-sm'>
			<div className='font-semibold text-lg text-gray-800'>
				Загрузка каналов из Excel
			</div>

			<div className='flex items-center gap-4'>
				<input
					type='file'
					accept='.xlsx,.xls'
					onChange={onFileChange}
					className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
				/>
			</div>

			{sheetNames.length > 0 && (
				<div className='space-y-4'>
					<div className='font-medium text-gray-700'>
						Выберите листы ({selectedSheets.length}/{sheetNames.length})
					</div>
					<div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3'>
						{sheetNames.map(name => {
							const sheetData = sheetInfo.find(s => s.name === name)
							const rows = sheetData?.rows ?? 0
							const totalRows = sheetData?.totalRows ?? 0
							const checked = selectedSheets.includes(name)
							return (
								<label
									key={name}
									className='flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50'
								>
									<input
										type='checkbox'
										checked={checked}
										onChange={() => toggleSheet(name)}
										className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
									/>
									<span className='truncate font-medium text-gray-800'>
										{name}
									</span>
									<span className='ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>
										{rows} rows
										{totalRows > rows && ` (${totalRows} total)`}
									</span>
								</label>
							)
						})}
					</div>

					<div className='text-sm text-gray-600 bg-blue-50 p-3 rounded-lg'>
						Выбрано строк: <b className='text-blue-700'>{totalSelectedRows}</b>
					</div>

					<button
						onClick={handleImport}
						className='px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
					>
						Импортировать
					</button>
				</div>
			)}

			<div className='space-y-2'>
				<div className='text-sm font-medium text-gray-700'>
					Статус: {status}
				</div>
				{progress > 0 && (
					<div className='w-full h-3 bg-gray-200 rounded-full overflow-hidden'>
						<div
							className='h-full bg-blue-500 rounded-full transition-all duration-300'
							style={{ width: `${progress}%` }}
							aria-valuenow={progress}
						/>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<details className='text-red-600 bg-red-50 p-3 rounded-lg'>
					<summary className='cursor-pointer font-medium'>
						Ошибки ({errors.length})
					</summary>
					<ul className='list-disc pl-5 mt-2 space-y-1'>
						{errors.map((e, i) => (
							<li
								key={i}
								className='text-sm'
							>
								{e}
							</li>
						))}
					</ul>
				</details>
			)}

			<div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
				<div className='font-medium mb-2'>Ожидаемые колонки:</div>
				<div className='grid grid-cols-2 gap-2 text-xs'>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Title</code> - название
						канала
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Username</code> -
						username без @
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Link</code> - ссылка на
						канал
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Description</code> -
						описание
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Language</code> - язык
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Members</code> -
						количество участников
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Price</code> - цена
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Status</code> - статус
						(ACTIVE/INACTIVE)
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Winrate</code> - винрейт
						в %
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Markets (csv)</code> -
						рынки через запятую
					</div>
				</div>
			</div>
		</div>
	)
}
