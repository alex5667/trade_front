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
}

export const Field = forwardRef<HTMLInputElement, InputFieldsProps>(
	(
		{
			id,
			label,
			extra,
			placeholder,
			variant,
			state,
			disabled,
			type,
			isNumber,
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
					className={cn(styles.fieldContainer, {
						[styles.fieldDisabled]: disabled,
						[styles.fieldError]: state === 'error',
						[styles.fieldSuccess]: state === 'success',
						[styles.fieldFocus]: !disabled && !state
					})}
					onKeyDown={event => {
						if (
							isNumber &&
							/![0-9]/.test(event.key) &&
							event.key !== 'Backspace' &&
							event.key !== 'Tab' &&
							event.key !== 'Enter' &&
							event.key !== 'ArrowLeft' &&
							event.key !== 'ArrowRight'
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

Field.displayName = 'Field'
