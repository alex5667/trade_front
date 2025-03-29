import cn from 'clsx'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { useOutside } from '@/hooks/useOutside'

import styles from './DatePicker.module.scss'
import { formatCaption } from './DatePickerCaption'

dayjs.extend(LocalizedFormat)

interface DatePicker {
	position?: 'left' | 'right'
	placement?: 'top' | 'bottom'
	setDate?: Dispatch<SetStateAction<Date | undefined>>
	extra?: string
}
export function DatePicker({
	position = 'right',
	placement = 'bottom',
	setDate,
	extra
}: DatePicker) {
	const [selected, setSelected] = useState<Date>()
	const { isShow, setIsShow, ref } = useOutside(false)

	const handleDaySelect = (date: Date | undefined) => {
		const ISOdate = date?.toISOString()
		setDate && setDate(date)
		setSelected(date)
		if (ISOdate) {
		} else {
			setDate && setDate(undefined)
			setSelected(undefined)
		}
		setIsShow(false)
	}
	const handleClearDate = () => {
		setDate && setDate(undefined)
		setSelected(undefined)
	}

	return (
		<div
			className={cn(styles.container, extra)}
			ref={ref}
		>
			<button
				className={styles.dateButton}
				onClick={() => setIsShow(!isShow)}
			>
				{selected ? dayjs(selected).format('LL') : 'Click for select'}
			</button>
			{selected && (
				<button
					className={styles.closeButton}
					onClick={handleClearDate}
				>
					<X size={14} />
				</button>
			)}
			{isShow && (
				<div
					className={cn(
						styles.slide,
						styles.datePickerContainer,
						position === 'left' ? styles.leftPosition : styles.rightPosition,
						placement === 'top' ? styles.topPlacement : styles.bottomPlacement
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
						// disabled={[
						// 	{
						// 		before: new Date()
						// 	}
						// ]}
					/>
				</div>
			)}
		</div>
	)
}
