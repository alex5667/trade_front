import cn from 'clsx'

import styles from './Checkbox.module.scss'

interface CheckboxProps {
	id?: string
	extra?: string
	color?: 'red' | 'blue' | 'green' | 'yellow'
	checked?: boolean
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Checkbox = ({
	id,
	extra,
	color,
	checked,
	onChange,
	...rest
}: CheckboxProps) => {
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
			checked={checked}
			onChange={onChange}
			className={cn(
				'defaultCheckbox',
				styles.defaultCheckboxes,
				colorClass,
				extra
			)}
			{...rest}
		/>
	)
}
