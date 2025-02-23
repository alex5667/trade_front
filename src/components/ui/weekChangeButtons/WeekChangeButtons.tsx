import cn from 'clsx'
import { Dispatch, SetStateAction } from 'react'

import { Button } from '../buttons/Button'

import styles from './WeekChangeButtons.module.scss'

interface WeekChangeButtonsProps {
	setWeekOffset: Dispatch<SetStateAction<number>>
	classNameWrapper?: string
	classNameButton?: string
}

const WeekChangeButtons = ({
	setWeekOffset,
	classNameWrapper,
	classNameButton
}: WeekChangeButtonsProps) => {
	const handleWeekChange = (direction: 'next' | 'prev') => {
		setWeekOffset(prev => (direction === 'next' ? prev + 1 : prev - 1))
	}

	return (
		<div className={cn(styles.btnWrapper, classNameWrapper)}>
			<Button
				className={cn('px-2 py-3 sm:px-4 sm:py-1', classNameButton)}
				onClick={() => handleWeekChange('prev')}
			>
				Предыдущая неделя
			</Button>
			<Button
				className={cn('px-2 py-3 sm:px-4 sm:py-1', classNameButton)}
				onClick={() => handleWeekChange('next')}
			>
				Следующая неделя
			</Button>
		</div>
	)
}

export default WeekChangeButtons
