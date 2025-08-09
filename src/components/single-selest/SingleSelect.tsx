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
			className={styles.container}
			ref={ref}
		>
			<button
				onClick={e => {
					e.preventDefault()
					setIsShow(!isShow)
				}}
				className={styles.fullWidth}
			>
				{getValue() ? (
					<Badge
						variant={value as BadgeVariant}
						className={cn(
							styles.capitalize,
							styles.hoverShadow,
							isColorSelect && styles.colorBadge
						)}
					>
						{getValue()}
					</Badge>
				) : (
					<Badge className={cn(styles.onPrimary, styles.hoverShadow)}>
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
							className={cn(
								styles.listButton,
								isColorSelect && styles.colorItem
							)}
							style={
								isColorSelect
									? ({ ['--color-item-bg' as any]: item.value } as any)
									: undefined
							}
						>
							<Badge
								className={styles.hoverShadow}
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
