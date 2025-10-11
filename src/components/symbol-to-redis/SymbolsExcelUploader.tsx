'use client'

import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'

import type { InstrumentType } from '@/types/symbol-to-redis.types'

import { useUploadExcelDataMutation } from '@/services/symbol-to-redis.api'

const RowSchema = z.object({
	symbol: z.string().min(1),
	baseAsset: z.string().optional(),
	quoteAsset: z.string().optional(),
	instrumentType: z
		.enum([
			'SPOT',
			'FUTURES',
			'FOREX',
			'METAL',
			'INDEX',
			'CRYPTO_INDEX',
			'OTHER'
		])
		.optional(),
	exchange: z.string().optional(),
	status: z.string().optional(),
	note: z.string().optional(),
	timeframes: z.array(z.string()).optional()
})

type RowDTO = z.infer<typeof RowSchema>

function normalizeInstrumentType(v?: string): InstrumentType | undefined {
	if (!v) return undefined
	const s = v.trim().toUpperCase()
	if (
		[
			'SPOT',
			'FUTURES',
			'FOREX',
			'METAL',
			'INDEX',
			'CRYPTO_INDEX',
			'OTHER'
		].includes(s)
	) {
		return s as InstrumentType
	}
	return 'OTHER'
}

function parseTimeframes(v?: string): string[] {
	if (!v) return []
	return v
		.split(/[,;/]/)
		.map(s => s.trim().toUpperCase())
		.filter(Boolean)
}

type SheetMeta = { name: string; rows: number; totalRows: number }

export default function SymbolsExcelUploader() {
	const [uploadExcelData, { isLoading: isUploading }] =
		useUploadExcelDataMutation()

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

		// Подсчет строк по листам
		const info: SheetMeta[] = book.SheetNames.map(n => {
			const ws = book.Sheets[n]

			const range = ws['!ref']
				? XLSX.utils.decode_range(ws['!ref'])
				: { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }
			const totalRows = range.e.r + 1

			const json = XLSX.utils.sheet_to_json(ws, {
				defval: '',
				raw: false
			})

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

		const rawRows: Record<string, any>[] = selectedSheets.flatMap(sheet => {
			const ws = wb.Sheets[sheet]
			return XLSX.utils.sheet_to_json(ws, { defval: '' }) as Record<
				string,
				any
			>[]
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
					symbol: String(r['Symbol'] ?? r['symbol'] ?? '').trim(),
					baseAsset:
						String(r['BaseAsset'] ?? r['Base'] ?? '').trim() || undefined,
					quoteAsset:
						String(r['QuoteAsset'] ?? r['Quote'] ?? '').trim() || undefined,
					instrumentType: normalizeInstrumentType(
						String(r['InstrumentType'] ?? r['Type'] ?? '')
					),
					exchange: String(r['Exchange'] ?? '').trim() || undefined,
					status: String(r['Status'] ?? '').trim() || undefined,
					note: String(r['Note'] ?? '').trim() || undefined,
					timeframes: parseTimeframes(String(r['Timeframes'] ?? ''))
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
		setProgress(50)

		const localErrors: string[] = []

		try {
			const resp = await uploadExcelData(mapped as any).unwrap()

			if (resp.errorCount > 0) {
				localErrors.push(
					`Импортировано: ${resp.importedCount}, ошибок: ${resp.errorCount}`
				)
				if (resp.errors && resp.errors.length > 0) {
					resp.errors.forEach((err: any) => {
						localErrors.push(`Строка ${err.row}: ${err.message}`)
					})
				}
			}

			setProgress(100)
			setStatus(localErrors.length ? 'Завершено с ошибками' : 'Готово ✅')
		} catch (err: any) {
			if (err?.data) {
				localErrors.push(
					`Ошибка сервера: ${err.data.message || 'Неизвестная ошибка'}`
				)
			} else if (err?.error) {
				localErrors.push(
					`Ошибка запроса: ${err.error.data?.message || err.error.status || 'Неизвестная ошибка'}`
				)
			} else {
				localErrors.push(`Ошибка отправки: ${err.message ?? String(err)}`)
			}
			setStatus('Ошибка импорта')
		}

		setErrors(localErrors)
	}

	return (
		<div className='space-y-4 p-4 border rounded-xl bg-white shadow-sm'>
			<div className='font-semibold text-lg text-gray-800'>
				Загрузка символов из Excel
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
						className='px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
						disabled={isUploading}
					>
						{isUploading ? (
							<div className='flex items-center gap-2'>
								<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
								Импортирую...
							</div>
						) : (
							'Импортировать'
						)}
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
						<code className='bg-gray-200 px-1 rounded'>Symbol</code> - торговый
						символ (обязательно)
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>BaseAsset</code> -
						базовая валюта
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>QuoteAsset</code> -
						котируемая валюта
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>InstrumentType</code> -
						тип (SPOT/FUTURES/FOREX/etc)
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Exchange</code> - биржа
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Status</code> - статус
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Note</code> - заметка
					</div>
					<div>
						<code className='bg-gray-200 px-1 rounded'>Timeframes</code> -
						таймфреймы через запятую (M1,M5,H1)
					</div>
				</div>
			</div>
		</div>
	)
}
