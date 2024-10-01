'use client'

import { DragDropContext } from '@hello-pangea/dnd'
import cn from 'clsx'

import { dayColumns } from '../columns.data'
import { useMealItemDnd } from '../hooks/useMealItemDnd'

import ListDayView from './ListDayView'
import styles from './ListView.module.scss'

interface ListView {
	institutionSlug: string
	daysOfWeek: string[]
}
export function ListView({ institutionSlug, daysOfWeek }: ListView) {
	const { onDragEnd } = useMealItemDnd()

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className={cn(styles.parentsWrapper)}>
				{dayColumns().map(column => {
					return (
						<ListDayView
							label={column.label}
							day={column.value}
							key={column.value}
							institutionSlug={institutionSlug}
							daysOfWeek={daysOfWeek}
						/>
					)
				})}
			</div>
		</DragDropContext>
	)
}
