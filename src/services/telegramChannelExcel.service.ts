import type { ExcelImportInfo, ImportExcelResponseDto } from '@/types/telegram.types'

/**
 * Сервис для работы с Excel импортом Telegram каналов
 */
export class TelegramChannelExcelService {
	/**
	 * Получить информацию об импорте Excel
	 */
	static async getImportInfo(): Promise<ExcelImportInfo> {
		try {
			const response = await fetch('/api/telegram-channels/excel/info')
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
			const response = await fetch('/api/telegram-channels/excel/template')
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`)
			}

			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'telegram-channels-template.xlsx'
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
	 * Загрузить файл Excel
	 */
	static async uploadFile(file: File): Promise<ImportExcelResponseDto> {
		try {
			const formData = new FormData()
			formData.append('file', file)

			const response = await fetch('/api/telegram-channels/excel/upload', {
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
			details.push(`✅ Успешно импортировано ${result.importedCount} каналов`)
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
} 