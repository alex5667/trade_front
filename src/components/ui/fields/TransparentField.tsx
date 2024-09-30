import cn from 'clsx'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

import styles from './Fields.module.scss'

type TransparentFieldProps = TextareaHTMLAttributes<HTMLInputElement> & {
	type?: 'list' | 'kanban'
}

export const TransparentField = forwardRef<
	HTMLInputElement,
	TransparentFieldProps
>(({ className, type, ...rest }, ref) => {
	return (
		<input
			className={cn(
				styles.inputTransparentField,
				className,
				{
					'hover:w-55p': type === 'list'
				},
				'hover:dark:bg-bg hover:bg-sidebar-light'
			)}
			ref={ref}
			{...rest}
		/>
	)
})

TransparentField.displayName = 'TransparentField'
