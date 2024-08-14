import cn from 'clsx'
import { type TextareaHTMLAttributes, forwardRef } from 'react'

import styles from './Fields.module.scss'

type TransparentFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	type?: 'list' | 'kanban'
}

export const TransparentField = forwardRef<
	HTMLTextAreaElement,
	TransparentFieldProps
>(({ className, type, ...rest }, ref) => {
	return (
		<textarea
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
