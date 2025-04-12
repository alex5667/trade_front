import cn from 'clsx'
import { forwardRef } from 'react'

import styles from './Fields.module.scss'

interface InputFieldsProps {
	id?: string // Уникальный идентификатор поля
	label?: string // Метка над полем
	extra?: string // Классы для обертки div
	placeholder?: string // Подсказка внутри поля
	variant?: string // Не используется в текущей версии, но оставлен для совместимости
	state?: 'error' | 'success' // Состояние поля (ошибка или успех)
	disabled?: boolean // Отключение поля
	type?: string // Тип поля (text, number и т.д.)
	isNumber?: boolean // Ограничение ввода только числами
	value?: string | number // Значение для контролируемого input
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void // Обработчик изменения
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void // Обработчик фокуса
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void // Обработчик фокуса
	style?: React.CSSProperties // Inline-стили для input
}

export const FieldInput = forwardRef<HTMLInputElement, InputFieldsProps>(
	(
		{
			id,
			label,
			extra,
			placeholder,
			variant,
			state,
			disabled,
			type = 'text',
			isNumber,
			value = '', // Значение по умолчанию — пустая строка
			onChange,
			onFocus,
			onBlur,
			style, // Передаем inline-стили
			...rest // Остальные пропсы для передачи в input
		},
		ref
	) => {
		return (
			<div className={cn(extra)}>
				{label && (
					<label
						htmlFor={id}
						className={cn(styles.label)}
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					disabled={disabled}
					type={type}
					id={id}
					placeholder={placeholder}
					value={value}
					onChange={e => {
						const newValue = isNumber ? Number(e.target.value) : e.target.value
						if (onChange)
							onChange(
								e as React.ChangeEvent<HTMLInputElement> & {
									target: { value: typeof newValue }
								}
							)
					}}
					onFocus={onFocus} // Обработчик фокуса
					className={cn(
						styles.fieldContainer, // Базовые стили из SCSS
						disabled && styles.fieldDisabled, // Стили для отключенного состояния
						state === 'error' && styles.fieldError, // Стили для ошибки
						state === 'success' && styles.fieldSuccess, // Стили для успеха
						!disabled && !state && styles.fieldFocus // Стили для фокуса
					)}
					style={style} // Inline-стили с приоритетом
					onKeyDown={event => {
						if (
							isNumber &&
							!/^\d$/.test(event.key) && // Только цифры
							!['.', '-'].includes(event.key) && // Поддержка точки и минуса
							![
								'Backspace',
								'Tab',
								'Enter',
								'ArrowLeft',
								'ArrowRight'
							].includes(event.key) // Разрешенные служебные клавиши
						) {
							event.preventDefault()
						}
					}}
					onBlur={onBlur}
					{...rest} // Передаем остальные пропсы (например, name, maxLength и т.д.)
				/>
			</div>
		)
	}
)

FieldInput.displayName = 'FieldInput'
