import cn from 'clsx'

interface Heading {
	title: string
	size?: '3xl' | '2xl' | 'xl' | 'xs' | 'base'
}

export function Heading({ title, size = '3xl' }: Heading) {
	return (
		<div>
			<h1
				className={cn('font-medium', {
					'text-3xl': size === '3xl',
					'text-2xl': size === '2xl',
					'text-xl': size === 'xl',
					'text-xs': size === 'xs',
					'text-base': size === 'base'
				})}
			>
				{title}{' '}
			</h1>
			<div className='my-3 h-[1px] bg-border w-full'></div>
		</div>
	)
}
