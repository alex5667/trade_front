import cn from 'clsx'
import { forwardRef } from 'react'

import styles from './Fields.module.scss'

interface InputFieldsProps {
	id: string
	label: string
	extra?: string
	placeholder: string
	variant?: string
	state?: 'error' | 'success'
	disabled?: boolean
	type?: string
	isNumber?: boolean
	value?: string // Добавлено, чтобы можно было контролировать input
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void // Исправленный onChange
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
			value = '', // Устанавливаем значение по умолчанию
			onChange,
			...rest
		},
		ref
	) => {
		return (
			<div className={cn(extra)}>
				<label
					htmlFor={id}
					className={cn(styles.label)}
				>
					{label}
				</label>
				<input
					ref={ref}
					disabled={disabled}
					type={type}
					id={id}
					placeholder={placeholder}
					value={value} // Передаём значение
					onChange={onChange} // Обрабатываем изменения
					className={cn(styles.fieldContainer, {
						[styles.fieldDisabled]: disabled,
						[styles.fieldError]: state === 'error',
						[styles.fieldSuccess]: state === 'success',
						[styles.fieldFocus]: !disabled && !state
					})}
					onKeyDown={event => {
						if (
							isNumber &&
							!/^\d$/.test(event.key) && // Блокируем нечисловые символы
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
					{...rest}
				/>
			</div>
		)
	}
)

FieldInput.displayName = 'FieldInput'
