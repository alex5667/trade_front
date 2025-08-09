import cn from 'clsx'
import { PropsWithChildren } from 'react'

import s from './Badge.module.scss'

export type BadgeVariant = 'low' | 'high' | 'medium' | 'gray' | 'select'
interface Badge {
	className?: string
	variant?: BadgeVariant
}

export function Badge({
	children,
	className,
	variant = 'gray'
}: PropsWithChildren<Badge>) {
	return <div className={cn(s.badge, s[variant], className)}>{children}</div>
}
