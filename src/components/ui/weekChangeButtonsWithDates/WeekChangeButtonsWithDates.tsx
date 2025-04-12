'use client'

import cn from 'clsx'
import dayjs from 'dayjs'

import { DatesOfWeek, getDatesOfWeek } from '@/utils/getDatesOfWeek'

import { Button } from '../buttons/Button'

import styles from './WeekChangeButtonsWithDates.module.scss'

export type StartEnDWeek = {
	startOfWeek: string
	endOfWeek: string
	datesOfWeek?: DatesOfWeek
}

interface WeekChangeButtonsProps {
	weekOffset: number
	onChangeWeek: (direction: 'next' | 'prev') => void
	classNameWrapper?: string
	classNameButton?: string
}

const WeekChangeButtonsWithDates = ({
	weekOffset,
	onChangeWeek,
	classNameWrapper,
	classNameButton
}: WeekChangeButtonsProps) => {
	const prevWeek = getDatesOfWeek(weekOffset - 1)
	const nextWeek = getDatesOfWeek(weekOffset + 1)

	return (
		<div className={cn(styles.btnsWrapper, classNameWrapper)}>
			<div className={cn(styles.btnWrapper)}>
				<Button
					className={cn('px-2 py-3 sm:px-4 sm:py-1 mb-2', classNameButton)}
					onClick={() => onChangeWeek('prev')}
				>
					Предыдущая неделя
				</Button>
				<div className={styles.dates}>
					<span>{dayjs(prevWeek.startOfWeek).format('DD-MM')}</span> /{' '}
					<span>{dayjs(prevWeek.endOfWeek).format('DD-MM')}</span>
				</div>
			</div>
			<div className={cn(styles.btnWrapper)}>
				<Button
					className={cn('px-2 py-3 sm:px-4 sm:py-1 mb-2', classNameButton)}
					onClick={() => onChangeWeek('next')}
				>
					Следующая неделя
				</Button>
				<div className={styles.dates}>
					<span>{dayjs(nextWeek.startOfWeek).format('DD-MM')}</span> /{' '}
					<span>{dayjs(nextWeek.endOfWeek).format('DD-MM')}</span>
				</div>
			</div>
		</div>
	)
}

export default WeekChangeButtonsWithDates
