import cn from 'clsx'
import { CSSProperties, PropsWithChildren } from 'react'

export type BadgeVariant = 'low' | 'high' | 'medium' | 'gray' | 'select'
interface Badge {
	className?: string
	variant?: BadgeVariant
	style?: CSSProperties
}

export function Badge({
	children,
	className,
	variant = 'gray',
	style
}: PropsWithChildren<Badge>) {
	return (
		<div
			className={cn(
				'rounded-lg  min-w-full py-1 px-2 text-sm  text-white transition',
				{
					'bg-[#79affd]': variant === 'low',
					'bg-[#777ae5]': variant === 'medium',
					'bg-[#6645a9]': variant === 'high',
					'bg-hover-row-dark0/20 ': variant === 'gray',
					'bg-hover-row-dark0/30 ': variant === 'select'
				},
				className
			)}
			style={style}
		>
			{children}
		</div>
	)
}
