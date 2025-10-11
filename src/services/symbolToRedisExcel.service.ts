/**
 * Сервис для работы с Excel импортом символов
 */

export interface ExcelImportInfo {
	supportedFormats: string[]
	maxFileSize: string
	requiredFields: string[]
	optionalFields: string[]
	exampleHeaders: string[]
	instrumentTypes: string[]
	statusValues: string[]
	timeframes: string[]
}

export interface ImportErrorDto {
	row: number
	column: string
	value: any
	message: string
}

export interface ImportedSymbolDto {
	id: string
	symbol: string
	baseAsset?: string
	quoteAsset?: string
	timeframes?: string[]
	row: number
}

export interface ImportExcelResponseDto {
	totalRows: number
	importedCount: number
	skippedCount: number
	errorCount: number
	errors: ImportErrorDto[]
	imported: ImportedSymbolDto[]
}

export class SymbolToRedisExcelService {
	/**
	 * Получить информацию об импорте Excel
	 */
	static async getImportInfo(): Promise<ExcelImportInfo> {
		try {
			const response = await fetch('/api/symbols/excel/info')
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}
			return await response.json()
		} catch (error) {
			console.error('Ошибка при получении информации об импорте:', error)
			throw error
		}
	}

	/**
	 * Скачать шаблон Excel
	 */
	static async downloadTemplate(): Promise<void> {
		try {
			const response = await fetch('/api/symbols/excel/template')
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'symbols-template.xlsx'
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)
		} catch (error) {
			console.error('Ошибка при скачивании шаблона:', error)
			throw error
		}
	}

	/**
	 * Загрузить данные символов из массива
	 */
	static async uploadData(data: any[]): Promise<ImportExcelResponseDto> {
		try {
			const response = await fetch('/api/symbols/excel/upload', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				const errorText = await response.text().catch(() => 'Unknown error')
				throw new Error(`HTTP ${response.status}: ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error('Ошибка при загрузке данных:', error)
			throw error
		}
	}

	/**
	 * Загрузить файл Excel
	 */
	static async uploadFile(file: File): Promise<ImportExcelResponseDto> {
		try {
			const formData = new FormData()
			formData.append('file', file)

			const response = await fetch('/api/symbols/excel/upload', {
				method: 'POST',
				body: formData
			})

			if (!response.ok) {
				const errorText = await response.text().catch(() => 'Unknown error')
				throw new Error(`HTTP ${response.status}: ${errorText}`)
			}

			return await response.json()
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error)
			throw error
		}
	}

	/**
	 * Валидировать файл перед загрузкой
	 */
	static validateFile(file: File): { isValid: boolean; errors: string[] } {
		const errors: string[] = []

		// Проверяем тип файла
		if (!file.name.match(/\.(xlsx|xls)$/i)) {
			errors.push('Файл должен быть в формате Excel (.xlsx или .xls)')
		}

		// Проверяем размер файла (максимум 10MB)
		if (file.size > 10 * 1024 * 1024) {
			errors.push('Размер файла не должен превышать 10MB')
		}

		return {
			isValid: errors.length === 0,
			errors
		}
	}

	/**
	 * Форматировать результат импорта для отображения
	 */
	static formatImportResult(result: ImportExcelResponseDto): {
		summary: string
		details: string[]
		hasErrors: boolean
	} {
		const summary = `Импортировано: ${result.importedCount}, пропущено: ${result.skippedCount}, ошибок: ${result.errorCount}`

		const details: string[] = []

		if (result.importedCount > 0) {
			details.push(`✅ Успешно импортировано ${result.importedCount} символов`)
		}

		if (result.skippedCount > 0) {
			details.push(`⏭️ Пропущено ${result.skippedCount} строк`)
		}

		if (result.errorCount > 0) {
			details.push(`❌ Найдено ${result.errorCount} ошибок`)
			result.errors.forEach(error => {
				details.push(`   Строка ${error.row}: ${error.message}`)
			})
		}

		return {
			summary,
			details,
			hasErrors: result.errorCount > 0
		}
	}

	/**
	 * Получить статистику импорта
	 */
	static getImportStats(result: ImportExcelResponseDto): {
		successRate: number
		totalProcessed: number
	} {
		const totalProcessed = result.importedCount + result.skippedCount + result.errorCount
		const successRate = totalProcessed > 0 ? (result.importedCount / totalProcessed) * 100 : 0

		return {
			successRate: Math.round(successRate * 100) / 100,
			totalProcessed
		}
	}

	/**
	 * Конвертировать Excel данные в формат для импорта
	 */
	static convertExcelDataToSymbols(data: any[]): any[] {
		return data.map(row => ({
			symbol: row.symbol || row.Symbol || row.SYMBOL,
			baseAsset: row.baseAsset || row.base || row.Base,
			quoteAsset: row.quoteAsset || row.quote || row.Quote,
			instrumentType: row.instrumentType || row.type || row.Type,
			timeframes: this.parseTimeframes(row.timeframes || row.Timeframes || row.TIMEFRAMES),
			exchange: row.exchange || row.Exchange,
			status: row.status || row.Status || 'ACTIVE',
			note: row.note || row.Note || row.notes || row.Notes
		}))
	}

	/**
	 * Разобрать таймфреймы из строки
	 */
	private static parseTimeframes(value: any): string[] {
		if (!value) return []
		if (Array.isArray(value)) return value
		if (typeof value === 'string') {
			return value.split(/[,;]/).map(s => s.trim()).filter(Boolean)
		}
		return []
	}

	/**
	 * Создать пример данных для Excel
	 */
	static createExampleData(): any[] {
		return [
			{
				symbol: 'BTCUSDT',
				baseAsset: 'BTC',
				quoteAsset: 'USDT',
				instrumentType: 'SPOT',
				timeframes: 'M1,M5,M15,H1,H4,D1',
				exchange: 'Binance',
				status: 'ACTIVE',
				note: 'Bitcoin trading pair'
			},
			{
				symbol: 'ETHUSDT',
				baseAsset: 'ETH',
				quoteAsset: 'USDT',
				instrumentType: 'SPOT',
				timeframes: 'M1,M5,M15,H1,H4,D1',
				exchange: 'Binance',
				status: 'ACTIVE',
				note: 'Ethereum trading pair'
			}
		]
	}
}

