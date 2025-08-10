import cn from 'clsx'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import styles from './Button.module.scss'

export type TypeButton = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?:
		| 'primary'
		| 'secondary'
		| 'danger'
		| 'ghost'
		| 'menu-item'
		| 'switcher'
		| 'add-item'
		| 'icon'
		| 'week-change'
		| 'google'
}

export function Button({
	children,
	className,
	variant = 'primary',
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(
				'linear',
				styles.button,
				variant && styles[variant],
				className
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
