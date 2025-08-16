# Telegram Channel Excel API - Frontend

Документация по использованию Excel API для импорта Telegram каналов на фронтенде.

## Основные компоненты

### 1. API Endpoints (telegramChannel.api.ts)

```typescript
// Получить информацию о поддерживаемых форматах
useGetExcelImportInfoQuery()

// Скачать шаблон Excel
useDownloadExcelTemplateQuery()

// Загрузить Excel файл
useUploadExcelFileMutation()
```

### 2. Сервис (telegramChannelExcel.service.ts)

```typescript
import { TelegramChannelExcelService } from './telegramChannelExcel.service'

// Получить информацию о форматах
const info = await TelegramChannelExcelService.getImportInfo()

// Скачать шаблон
await TelegramChannelExcelService.downloadTemplate()

// Загрузить файл
const result = await TelegramChannelExcelService.uploadFile(file)

// Валидировать файл
const validation = TelegramChannelExcelService.validateFile(file)

// Форматировать результат
const formatted = TelegramChannelExcelService.formatImportResult(result)
```

## Пример использования

### Базовый компонент для загрузки Excel

```tsx
import React, { useState } from 'react'

import type { ImportExcelResponseDto } from '@/types/telegram.types'

import { useUploadExcelFileMutation } from './telegramChannel.api'
import { TelegramChannelExcelService } from './telegramChannelExcel.service'

export const ExcelUploader: React.FC = () => {
	const [file, setFile] = useState<File | null>(null)
	const [uploadFile, { isLoading, error }] = useUploadExcelFileMutation()
	const [result, setResult] = useState<ImportExcelResponseDto | null>(null)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0]
		if (selectedFile) {
			// Валидируем файл
			const validation = TelegramChannelExcelService.validateFile(selectedFile)
			if (validation.isValid) {
				setFile(selectedFile)
			} else {
				alert(`Ошибки валидации: ${validation.errors.join(', ')}`)
			}
		}
	}

	const handleUpload = async () => {
		if (!file) return

		try {
			const uploadResult = await uploadFile(file).unwrap()
			setResult(uploadResult)

			// Форматируем результат для отображения
			const formatted =
				TelegramChannelExcelService.formatImportResult(uploadResult)
			console.log(formatted.summary)
		} catch (error) {
			console.error('Ошибка загрузки:', error)
		}
	}

	const handleDownloadTemplate = async () => {
		try {
			await TelegramChannelExcelService.downloadTemplate()
		} catch (error) {
			console.error('Ошибка скачивания шаблона:', error)
		}
	}

	return (
		<div>
			<h2>Загрузка Excel файла с каналами</h2>

			<div>
				<button onClick={handleDownloadTemplate}>Скачать шаблон</button>
			</div>

			<div>
				<input
					type='file'
					accept='.xlsx,.xls'
					onChange={handleFileChange}
				/>
			</div>

			{file && (
				<div>
					<p>Выбран файл: {file.name}</p>
					<button
						onClick={handleUpload}
						disabled={isLoading}
					>
						{isLoading ? 'Загрузка...' : 'Загрузить'}
					</button>
				</div>
			)}

			{error && (
				<div style={{ color: 'red' }}>Ошибка: {JSON.stringify(error)}</div>
			)}

			{result && (
				<div>
					<h3>Результат импорта</h3>
					<p>Всего строк: {result.totalRows}</p>
					<p>Импортировано: {result.importedCount}</p>
					<p>Ошибок: {result.errorCount}</p>
					<p>Пропущено: {result.skippedCount}</p>

					{result.errors.length > 0 && (
						<div>
							<h4>Ошибки:</h4>
							{result.errors.map((error, index) => (
								<div key={index}>
									Строка {error.row}, колонка "{error.column}": {error.message}
								</div>
							))}
						</div>
					)}

					{result.imported.length > 0 && (
						<div>
							<h4>Импортированные каналы:</h4>
							{result.imported.map(channel => (
								<div key={channel.id}>
									{channel.title} {channel.username && `(@${channel.username})`}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
```

### Компонент с информацией о форматах

```tsx
import React from 'react'

import { useGetExcelImportInfoQuery } from './telegramChannel.api'

export const ExcelFormatInfo: React.FC = () => {
	const { data: info, isLoading, error } = useGetExcelImportInfoQuery()

	if (isLoading) return <div>Загрузка информации...</div>
	if (error) return <div>Ошибка загрузки информации</div>
	if (!info) return <div>Информация не найдена</div>

	return (
		<div>
			<h3>Поддерживаемые форматы Excel</h3>

			<div>
				<h4>Форматы файлов:</h4>
				<ul>
					{info.supportedFormats.map(format => (
						<li key={format}>{format}</li>
					))}
				</ul>
			</div>

			<div>
				<h4>Максимальный размер:</h4>
				<p>{info.maxFileSize}</p>
			</div>

			<div>
				<h4>Обязательные поля:</h4>
				<ul>
					{info.requiredFields.map(field => (
						<li key={field}>{field}</li>
					))}
				</ul>
			</div>

			<div>
				<h4>Опциональные поля:</h4>
				<ul>
					{info.optionalFields.map(field => (
						<li key={field}>{field}</li>
					))}
				</ul>
			</div>

			<div>
				<h4>Пример заголовков:</h4>
				<code>{info.exampleHeaders.join(', ')}</code>
			</div>
		</div>
	)
}
```

## Типы данных

### ImportExcelResponseDto

```typescript
interface ImportExcelResponseDto {
	totalRows: number // Общее количество строк
	importedCount: number // Количество импортированных каналов
	skippedCount: number // Количество пропущенных строк
	errorCount: number // Количество ошибок
	errors: ImportErrorDto[] // Детали по ошибкам
	imported: ImportedChannelDto[] // Импортированные каналы
}
```

### ImportErrorDto

```typescript
interface ImportErrorDto {
	row: number // Номер строки в Excel
	column: string // Название колонки
	value: any // Значение, вызвавшее ошибку
	message: string // Описание ошибки
}
```

### ExcelImportInfo

```typescript
interface ExcelImportInfo {
	supportedFormats: string[] // Поддерживаемые форматы
	maxFileSize: string // Максимальный размер файла
	requiredFields: string[] // Обязательные поля
	optionalFields: string[] // Опциональные поля
	exampleHeaders: string[] // Пример заголовков
}
```

## Обработка ошибок

### Валидация файла

```typescript
const validation = TelegramChannelExcelService.validateFile(file)
if (!validation.isValid) {
  console.error('Ошибки валидации:', validation.errors)
  return
}
```

### Обработка ошибок загрузки

```typescript
try {
	const result = await uploadFile(file).unwrap()
	// Успешная загрузка
} catch (error) {
	if ('status' in error) {
		switch (error.status) {
			case 400:
				console.error('Ошибка валидации файла')
				break
			case 413:
				console.error('Файл слишком большой')
				break
			default:
				console.error('Ошибка загрузки:', error)
		}
	}
}
```

## Лучшие практики

1. **Валидация на клиенте**: Всегда валидируйте файл перед загрузкой
2. **Обработка ошибок**: Показывайте пользователю понятные сообщения об ошибках
3. **Прогресс загрузки**: Используйте `isLoading` для отображения состояния
4. **Обновление списка**: После успешной загрузки обновите список каналов
5. **Шаблоны**: Предоставьте пользователю возможность скачать шаблон

## Интеграция с Redux

API автоматически интегрируется с Redux store:

- После успешной загрузки список каналов обновляется
- Используйте `useGetTelegramChannelsQuery()` для отображения актуальных данных
- Теги автоматически инвалидируются при изменении данных
