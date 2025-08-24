import { useEffect, useState } from 'react'

import { SimpleField } from '@/components/ui/fields/SImpleField'

import {
	type CreateSymbolToRedisDto,
	DEFAULT_TIMEFRAMES,
	INSTRUMENT_TYPES
} from '@/types/symbol-to-redis.types'

import styles from './SymbolForm.module.scss'
import { TimeframeSelector } from './TimeframeSelector'

interface SymbolFormProps {
	initialData?: Partial<CreateSymbolToRedisDto>
	onSubmit: (data: CreateSymbolToRedisDto) => void
	onCancel: () => void
	isLoading?: boolean
}

export const SymbolForm = ({
	initialData,
	onSubmit,
	onCancel,
	isLoading = false
}: SymbolFormProps) => {
	const [formData, setFormData] = useState<CreateSymbolToRedisDto>({
		symbol: '',
		baseAsset: '',
		quoteAsset: '',
		instrumentType: 'FUTURES',
		timeframes: initialData?.timeframes || DEFAULT_TIMEFRAMES,
		exchange: 'binance',
		status: 'TRADING',
		note: '',
		...initialData
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		if (initialData) {
			setFormData(prev => ({
				...prev,
				...initialData,
				timeframes: initialData.timeframes || DEFAULT_TIMEFRAMES
			}))
		}
	}, [initialData])

	const handleInputChange = (
		field: keyof CreateSymbolToRedisDto,
		value: string
	) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		// Очищаем ошибку при изменении поля
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }))
		}
	}

	const handleTimeframesChange = (timeframes: string[]) => {
		setFormData(prev => ({ ...prev, timeframes }))
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.symbol.trim()) {
			newErrors.symbol = 'Символ обязателен'
		}

		if (formData.symbol.length < 2) {
			newErrors.symbol = 'Символ должен содержать минимум 2 символа'
		}

		if (formData.symbol.length > 20) {
			newErrors.symbol = 'Символ не должен превышать 20 символов'
		}

		if (formData.exchange && formData.exchange.length > 20) {
			newErrors.exchange = 'Название биржи не должно превышать 20 символов'
		}

		if (formData.status && formData.status.length > 50) {
			newErrors.status = 'Статус не должен превышать 50 символов'
		}

		if (formData.note && formData.note.length > 500) {
			newErrors.note = 'Примечание не должно превышать 500 символов'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (validateForm()) {
			onSubmit(formData)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={styles.form}
		>
			<div className={styles.formHeader}>
				<h2 className={styles.title}>
					{initialData ? 'Редактировать символ' : 'Создать новый символ'}
				</h2>
				<button
					type='button'
					onClick={onCancel}
					className={styles.closeButton}
					aria-label='Закрыть окно'
				>
					✕
				</button>
			</div>

			<div className={styles.formGrid}>
				<div className={styles.formField}>
					<SimpleField
						id='symbol'
						label='Символ *'
						placeholder='BTCUSDT'
						value={formData.symbol}
						onChange={e => handleInputChange('symbol', e.target.value)}
					/>
					{errors.symbol && <div className={styles.error}>{errors.symbol}</div>}
				</div>

				<div className={styles.formField}>
					<SimpleField
						id='baseAsset'
						label='Базовая валюта'
						placeholder='BTC'
						value={formData.baseAsset}
						onChange={e => handleInputChange('baseAsset', e.target.value)}
					/>
				</div>

				<div className={styles.formField}>
					<SimpleField
						id='quoteAsset'
						label='Котируемая валюта'
						placeholder='USDT'
						value={formData.quoteAsset}
						onChange={e => handleInputChange('quoteAsset', e.target.value)}
					/>
				</div>

				<div className={styles.formField}>
					<label className={styles.label}>Тип инструмента</label>
					<select
						value={formData.instrumentType}
						onChange={e => handleInputChange('instrumentType', e.target.value)}
						className={styles.select}
					>
						{INSTRUMENT_TYPES.map(type => (
							<option
								key={type}
								value={type}
							>
								{type}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formField}>
					<SimpleField
						id='exchange'
						label='Биржа'
						placeholder='binance'
						value={formData.exchange}
						onChange={e => handleInputChange('exchange', e.target.value)}
					/>
				</div>

				<div className={styles.formField}>
					<SimpleField
						id='status'
						label='Статус'
						placeholder='TRADING'
						value={formData.status}
						onChange={e => handleInputChange('status', e.target.value)}
					/>
				</div>
			</div>

			<div className={styles.timeframeSection}>
				<div className={styles.timeframeInfo}>
					<p className={styles.timeframeNote}>
						По умолчанию выбраны таймфреймы: M1, M5, M15, M30, H1, H4, D, W
					</p>
				</div>
				<TimeframeSelector
					selectedTimeframes={formData.timeframes || []}
					onTimeframesChange={handleTimeframesChange}
				/>
			</div>

			<div className={styles.noteSection}>
				<SimpleField
					id='note'
					label='Примечание'
					placeholder='Дополнительная информация о символе'
					value={formData.note}
					onChange={e => handleInputChange('note', e.target.value)}
					extra='h-20'
				/>
			</div>

			<div className={styles.formActions}>
				<button
					type='button'
					onClick={onCancel}
					className={styles.cancelButton}
					disabled={isLoading}
				>
					Отмена
				</button>
				<button
					type='submit'
					className={styles.submitButton}
					disabled={isLoading}
				>
					{isLoading ? 'Сохранение...' : initialData ? 'Обновить' : 'Создать'}
				</button>
			</div>
		</form>
	)
}
