import cn from 'clsx'

interface Heading {
	title: string
	size?: '3xl' | '2xl' | 'xl' | 'xs' | 'base' | 'lg'
	className?: string
}

export function Heading({ title, className, size = '3xl' }: Heading) {
	return (
		<div>
			<h2
				className={cn(
					'font-medium',
					{
						'text-3xl': size === '3xl',
						'text-2xl': size === '2xl',
						'text-xl': size === 'xl',
						'text-xs': size === 'xs',
						'text-base': size === 'base',
						'text-lg': size === 'lg'
					},
					className
				)}
			>
				{title}
			</h2>
			{/* <div className='my-3 h-[1px] bg-border w-full'></div> */}
		</div>
	)
}
