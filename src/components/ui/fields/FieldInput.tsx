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
	inputClassName?: string
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
			inputClassName,
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
					onFocus={onFocus}
					className={cn(
						styles.fieldContainer,
						disabled && styles.fieldDisabled,
						state === 'error' && styles.fieldError,
						state === 'success' && styles.fieldSuccess,
						!disabled && !state && styles.fieldFocus,
						inputClassName
					)}
					onKeyDown={event => {
						if (
							isNumber &&
							!/^\d$/.test(event.key) &&
							!['.', '-'].includes(event.key) &&
							![
								'Backspace',
								'Tab',
								'Enter',
								'ArrowLeft',
								'ArrowRight'
							].includes(event.key)
						) {
							event.preventDefault()
						}
					}}
					onBlur={onBlur}
					{...rest}
				/>
			</div>
		)
	}
)

FieldInput.displayName = 'FieldInput'
