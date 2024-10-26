import cn from 'clsx'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { X } from 'lucide-react'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { useOutside } from '@/hooks/useOutside'

import styles from './DatePicker.module.scss'
import { formatCaption } from './DatePickerCaption'
import { useUpdateMenuItemMutation } from '@/services/menu-item.service'

dayjs.extend(LocalizedFormat)

interface DatePicker {
	position?: 'left' | 'right'
}
export function DatePicker({ position = 'right' }: DatePicker) {
	const [selected, setSelected] = useState<Date>()
	const { isShow, setIsShow, ref } = useOutside(false)
	const [updateMenuItem] = useUpdateMenuItemMutation()

	const handleDaySelect = (date: Date | undefined) => {
		const ISOdate = date?.toISOString()
		setSelected(date)
		if (ISOdate) {
			// const updatedData = { ...item, dishId }
			// updateMenuItem({ id: item.id, date: ISOdate })
		} else {
			setSelected(undefined)
		}
		setIsShow(false)
	}

	return (
		<div
			className={cn(styles.container)}
			ref={ref}
		>
			<button
				className='text-xs px-4 py-1 rounded-lg hover:bg-primary-color'
				onClick={() => setIsShow(!isShow)}
			>
				{selected ? dayjs(selected).format('LL') : 'Click for select'}
			</button>
			{selected && (
				<button
					className={styles.closeButton}
					onClick={() => setSelected(undefined)}
				>
					<X size={14} />
				</button>
			)}
			{isShow && (
				<div
					className={cn(
						' slide ',
						styles.datePickerContainer,
						position === 'left' ? '-left-4' : '-right-4'
					)}
				>
					<DayPicker
						startMonth={new Date(2024, 0)}
						endMonth={new Date(2031, 11)}
						mode='single'
						defaultMonth={selected}
						selected={selected}
						onSelect={handleDaySelect}
						weekStartsOn={1}
						formatters={{ formatCaption }}
						disabled={[
							{
								before: new Date()
							}
						]}
					/>
				</div>
			)}
		</div>
	)
}
