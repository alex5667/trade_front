import cn from 'clsx'

import { useOutside } from '@/hooks/useOutside'

import { Badge, type BadgeVariant } from '../ui/Badge'

import styles from './SingleSelect.module.scss'

export interface Option {
	label: string
	value: string
}

interface SingleSelect {
	data: Option[]
	onChange: (value: string) => void
	value: BadgeVariant | string
	isColorSelect?: boolean
}

export function SingleSelect({
	data,
	onChange,
	value,
	isColorSelect
}: SingleSelect) {
	const { isShow, ref, setIsShow } = useOutside(false)
	const getValue = () => data.find(item => item.value === value)?.value

	return (
		<div
			className={cn(styles.container, 'min-w-full ')}
			ref={ref}
		>
			<button
				onClick={e => {
					e.preventDefault()
					setIsShow(!isShow)
				}}
				className='block min-w-full'
			>
				{getValue() ? (
					<Badge
						variant={value as BadgeVariant}
						className='capitalize hover:animate-shadow-inset-center'
						style={
							isColorSelect
								? { backgroundColor: value, opacity: '90', color: '#fff' }
								: {}
						}
					>
						{getValue()}
					</Badge>
				) : (
					<Badge className='text-text-color-on-primary hover:animate-shadow-inset-center'>
						Click for select
					</Badge>
				)}
			</button>
			{value && (
				<button
					className={styles.closeButton}
					onClick={e => {
						e.preventDefault()
						onChange('')
					}}
				>
					{/* <X size={14} /> */}
				</button>
			)}
			{isShow && (
				<div className={cn('slide', styles.listContainer)}>
					{data.map(item => (
						<button
							key={item.value}
							onClick={e => {
								e.preventDefault()
								onChange(item.value)
								setIsShow(false)
							}}
							className={styles.listButton}
							style={
								isColorSelect
									? {
											backgroundColor: item.value
										}
									: {}
							}
						>
							<Badge
								className='hover:animate-shadow-inset-center'
								variant={item.value as BadgeVariant}
							>
								{item.label}
							</Badge>
						</button>
					))}
				</div>
			)}
		</div>
	)
}
