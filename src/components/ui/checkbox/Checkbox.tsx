import cn from 'clsx'

import styles from './Checkbox.module.scss'

interface Checkbox {
	id?: string
	extra?: string
	color?: 'red' | 'blue' | 'green' | 'yellow'
	[x: string]: any
}

export const Checkbox = ({ id, extra, color, ...rest }: Checkbox) => {
	const colorClass = cn({
		[styles['checked-red']]: color === 'red',
		[styles['checked-blue']]: color === 'blue',
		[styles['checked-green']]: color === 'green',
		[styles['checked-yellow']]: color === 'yellow',
		[styles['checked-brand']]: !['red', 'blue', 'green', 'yellow'].includes(
			color || ''
		)
	})

	return (
		<input
			id={id}
			type='checkbox'
			className={cn(
				'defaultCheckbox',
				styles.defaultCheckboxes,
				colorClass,
				extra
			)}
			name='weekly'
			{...rest}
		/>
	)
}
