import cn from 'clsx'
import dayjs from 'dayjs'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

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
	const handleWeekChange = (direction: 'next' | 'prev') => {
		setWeekOffset(prev => (direction === 'next' ? prev + 1 : prev - 1))
	}
	useEffect(() => {
		setStartEndDate({
			startOfWeek,
			endOfWeek,
			datesOfWeek
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [weekOffset])
	return (
		<div className={cn(styles.btnsWrapper, classNameWrapper)}>
			<div className={cn(styles.btnWrapper)}>
				<Button
					className={cn('px-2 py-3 sm:px-4 sm:py-1 mb-2', classNameButton)}
					onClick={() => handleWeekChange('prev')}
				>
					Предыдущая неделя
				</Button>
				<span>{dayjs(startOfWeek).format('DD-MM-YYYY')}</span>
			</div>

			<div className={cn(styles.btnWrapper)}>
				<Button
					className={cn('px-2 py-3 sm:px-4 sm:py-1  mb-2', classNameButton)}
					onClick={() => handleWeekChange('next')}
				>
					Следующая неделя
				</Button>
				<span>{dayjs(endOfWeek).format('DD-MM-YYYY')}</span>
			</div>
		</div>
	)
}

export default WeekChangeButtonsWithDates
