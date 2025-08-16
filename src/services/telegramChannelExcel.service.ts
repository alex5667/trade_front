import type { ExcelImportInfo, ImportExcelResponseDto } from '@/types/telegram.types'
import { telegramChannelApi } from './telegramChannel.api'

/**
 * Сервис для работы с Excel файлами Telegram каналов
 */
export class TelegramChannelExcelService {
	/**
	 * Получить информацию о поддерживаемых форматах Excel
	 */
	static async getImportInfo(): Promise<ExcelImportInfo> {
		try {
			const result = await telegramChannelApi.endpoints.getExcelImportInfo.initiate()
			if ('data' in result && result.data) {
				return result.data as ExcelImportInfo
			}
			throw new Error('Не удалось получить информацию о форматах')
		} catch (error) {
			console.error('Ошибка при получении информации о форматах:', error)
			throw error
		}
	}

	/**
	 * Скачать шаблон Excel файла
	 */
	static async downloadTemplate(): Promise<void> {
		try {
			const result = await telegramChannelApi.endpoints.downloadExcelTemplate.initiate()
			if ('data' in result && result.data) {
				// Создаем ссылку для скачивания
				const url = window.URL.createObjectURL(result.data as Blob)
				const link = document.createElement('a')
				link.href = url
				link.download = 'telegram-channels-template.xlsx'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				window.URL.revokeObjectURL(url)
			} else {
				throw new Error('Не удалось скачать шаблон')
			}
		} catch (error) {
			console.error('Ошибка при скачивании шаблона:', error)
			throw error
		}
	}

	/**
	 * Загрузить Excel файл с каналами
	 */
	static async uploadFile(file: File): Promise<ImportExcelResponseDto> {
		try {
			// Проверяем тип файла
			if (!file.name.match(/\.(xlsx|xls)$/)) {
				throw new Error('Поддерживаются только Excel файлы (.xlsx, .xls)')
			}

			// Проверяем размер файла (10MB)
			if (file.size > 10 * 1024 * 1024) {
				throw new Error('Размер файла не может превышать 10MB')
			}

			// Создаем FormData
			const formData = new FormData()
			formData.append('file', file)

			// Загружаем файл
			const result = await telegramChannelApi.endpoints.uploadExcelFile.initiate(formData)
			if ('data' in result && result.data) {
				return result.data as ImportExcelResponseDto
			}
			throw new Error('Не удалось загрузить файл')
		} catch (error) {
			console.error('Ошибка при загрузке файла:', error)
			throw error
		}
	}

	/**
	 * Создать пример Excel файла для тестирования
	 */
	static createExampleFile(): void {
		// Создаем пример данных
		const exampleData = [
			['title', 'username', 'link', 'description', 'language', 'membersCount', 'isPaid', 'price', 'signalsFormat', 'markets', 'tags', 'winratePct', 'status', 'source'],
			['Crypto Trading Signals', 'cryptotrading', 'https://t.me/cryptotrading', 'Канал с сигналами по криптовалютам', 'ru', '10000', 'true', '50', 'ENTRY_SL_TP', 'crypto,forex', 'signals,trading,crypto', '75.5', 'ACTIVE', 'IMPORTED'],
			['Forex Analysis', 'forexanalysis', 'https://t.me/forexanalysis', 'Аналитика по валютным парам', 'en', '5000', 'false', '', 'ANALYTICS', 'forex', 'analysis,forex', '80.0', 'ACTIVE', 'IMPORTED'],
			['Gold Trading', 'goldtrading', 'https://t.me/goldtrading', 'Сигналы по золоту', 'ru', '3000', 'true', '30', 'BOTH', 'metal', 'gold,metal,trading', '70.0', 'ACTIVE', 'IMPORTED']
		]

		// Конвертируем в CSV (простой формат для примера)
		const csvContent = exampleData.map(row => row.join(',')).join('\n')

		// Создаем и скачиваем файл
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'telegram-channels-example.csv'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	}

	/**
	 * Валидировать файл перед загрузкой
	 */
	static validateFile(file: File): { isValid: boolean; errors: string[] } {
		const errors: string[] = []

		// Проверяем тип файла
		if (!file.name.match(/\.(xlsx|xls)$/)) {
			errors.push('Поддерживаются только Excel файлы (.xlsx, .xls)')
		}

		// Проверяем размер файла
		if (file.size > 10 * 1024 * 1024) {
			errors.push('Размер файла не может превышать 10MB')
		}

		// Проверяем, что файл не пустой
		if (file.size === 0) {
			errors.push('Файл не может быть пустым')
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
		hasWarnings: boolean
	} {
		const details: string[] = []
		let hasErrors = false
		let hasWarnings = false

		// Основная статистика
		details.push(`Всего строк: ${result.totalRows}`)
		details.push(`Импортировано: ${result.importedCount}`)
		details.push(`Пропущено: ${result.skippedCount}`)

		// Ошибки
		if (result.errorCount > 0) {
			hasErrors = true
			details.push(`Ошибок: ${result.errorCount}`)

			// Детали по ошибкам
			result.errors.forEach(error => {
				details.push(`Строка ${error.row}, колонка "${error.column}": ${error.message}`)
			})
		}

		// Предупреждения
		if (result.skippedCount > 0) {
			hasWarnings = true
			details.push(`Пропущено строк: ${result.skippedCount}`)
		}

		// Успешные импорты
		if (result.importedCount > 0) {
			details.push('Успешно импортированные каналы:')
			result.imported.forEach(channel => {
				details.push(`  • ${channel.title}${channel.username ? ` (@${channel.username})` : ''}`)
			})
		}

		const summary = `Импорт завершен: ${result.importedCount} из ${result.totalRows} каналов успешно импортировано`

		return {
			summary,
			details,
			hasErrors,
			hasWarnings
		}
	}
} 