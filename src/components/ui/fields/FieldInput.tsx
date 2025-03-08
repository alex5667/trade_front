import cn from 'clsx'
import { forwardRef } from 'react'

import styles from './Fields.module.scss'

interface InputFieldsProps {
	id: string
	label?: string
	extra?: string
	inputStyle?: string
	placeholder: string
	variant?: string
	state?: 'error' | 'success'
	disabled?: boolean
	type?: string
	isNumber?: boolean
	value?: string | number // Добавлено, чтобы можно было контролировать input
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	style?: React.CSSProperties // Добавляем поддержку inline-стилей
}

export const FieldInput = forwardRef<HTMLInputElement, InputFieldsProps>(
	(
		{
			id,
			label,
			extra,
			inputStyle,
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
					value={value} // Передаём значение
					onChange={e => {
						const newValue = isNumber ? Number(e.target.value) : e.target.value
						if (onChange)
							onChange(
								e as React.ChangeEvent<HTMLInputElement> & {
									target: { value: typeof newValue }
								}
							)
					}}
					className={cn(
						styles.fieldContainer,
						inputStyle,
						disabled && styles.fieldDisabled,
						state === 'error' && styles.fieldError,
						state === 'success' && styles.fieldSuccess,
						!disabled && !state && styles.fieldFocus
					)}
					onKeyDown={event => {
						if (
							isNumber &&
							!/^\d$/.test(event.key) && // Числа
							!['.', '-'].includes(event.key) && // Поддержка десятичной точки и минуса
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
