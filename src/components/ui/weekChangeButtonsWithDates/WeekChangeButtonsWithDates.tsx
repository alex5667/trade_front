'use client'

import cn from 'clsx'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useState } from 'react'

import { DatesOfWeek, getDatesOfWeek } from '@/utils/getDatesOfWeek'

import { Button } from '../buttons/Button'

import styles from './WeekChangeButtonsWithDates.module.scss'

export type StartEnDWeek = {
	startOfWeek: string
	endOfWeek: string
	datesOfWeek?: DatesOfWeek
}

interface WeekChangeButtonsProps {
	setStartEndDate: Dispatch<SetStateAction<StartEnDWeek | undefined>>
	classNameWrapper?: string
	classNameButton?: string
}

const WeekChangeButtonsWithDates = ({
	setStartEndDate,
	classNameWrapper,
	classNameButton
}: WeekChangeButtonsProps) => {
	const [weekOffset, setWeekOffset] = useState(0)

	const { startOfWeek, endOfWeek, datesOfWeek } = getDatesOfWeek(weekOffset)
	const prevWeek = getDatesOfWeek(weekOffset - 1)
	const nextWeek = getDatesOfWeek(weekOffset + 1)

	const handleWeekChange = (direction: 'next' | 'prev') => {
		const newOffset = direction === 'next' ? weekOffset + 1 : weekOffset - 1
		setWeekOffset(newOffset)
		const newDates = getDatesOfWeek(newOffset)
		setStartEndDate({
			startOfWeek: newDates.startOfWeek,
			endOfWeek: newDates.endOfWeek,
			datesOfWeek: newDates.datesOfWeek
		})
	}

	return (
		<div className={cn(styles.btnsWrapper, classNameWrapper)}>
			<div className={cn(styles.btnWrapper)}>
				<Button
					className={cn('px-2 py-3 sm:px-4 sm:py-1 mb-2', classNameButton)}
					onClick={() => handleWeekChange('prev')}
				>
					Предыдущая неделя
				</Button>
				<div className={styles.dates}>
					<span>{dayjs(prevWeek.startOfWeek).format('DD-MM')}</span>
					{' / '}
					<span>{dayjs(prevWeek.endOfWeek).format('DD-MM')}</span>
				</div>
			</div>
			<div className={cn(styles.btnWrapper)}>
				<Button
					className={cn('px-2 py-3 sm:px-4 sm:py-1 mb-2', classNameButton)}
					onClick={() => handleWeekChange('next')}
				>
					Следующая неделя
				</Button>
				<div className={styles.dates}>
					<span>{dayjs(nextWeek.startOfWeek).format('DD-MM')}</span>
					{' / '}
					<span>{dayjs(nextWeek.endOfWeek).format('DD-MM')}</span>
				</div>
			</div>
			{/* Отображаем текущую неделю */}
			{/* <div className={styles.currentWeek}>
				Текущая неделя: {dayjs(startOfWeek).format('DD-MM')} -{' '}
				{dayjs(endOfWeek).format('DD-MM')}
			</div> */}
		</div>
	)
}

export default WeekChangeButtonsWithDates
