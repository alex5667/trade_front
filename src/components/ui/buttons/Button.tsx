import cn from 'clsx'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import styles from './Button.module.scss'

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
	children,
	className,
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(
				'linear',
				styles.button,

				className
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
