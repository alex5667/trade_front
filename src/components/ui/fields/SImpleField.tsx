import cn from 'clsx'
import { forwardRef } from 'react'

import styles from './Fields.module.scss'

interface InputFieldsProps {
	id: string
	label?: string
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	extra?: string
	placeholder?: string
	variant?: string
	disabled?: boolean
	type?: string
	isNumber?: boolean
}

export const SimpleField = forwardRef<HTMLInputElement, InputFieldsProps>(
	(
		{
			id,
			label,
			extra,
			onChange,
			placeholder,
			variant,
			disabled,
			type = 'text',
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
					className={cn(styles.fieldContainer)}
					onChange={onChange}
					{...rest}
				/>
			</div>
		)
	}
)

SimpleField.displayName = 'SimpleField'
