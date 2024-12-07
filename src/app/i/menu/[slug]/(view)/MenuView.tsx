'use client'

import { useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'
import WeekChangeButtons from '@/components/weekChangeButtons/WeekChangeButtons'

import { MenuItemDataFilters } from '@/types/menuItem.type'

import { useLocalStorage } from '@/hooks/useLocalStorage'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import styles from './MenuView.module.scss'
import { ListView } from './list-view/ListView'
import { useGetAllMenuItemQuery } from '@/services/menu-item.service'

interface MenuView {
	institutionSlug: string
}

export type TypeView = 'list' | 'kanban'
// const ListView = dynamic(
// 	() => import('./list-view/ListView').then(mod => mod.ListView),
// 	{
// 		loading: () => <Loader />
// 	}
// )
// const KanbanView = dynamic(
// 	() => import('./kanban-view/KanbanView').then(mod => mod.KanbanView),
// 	{
// 		loading: () => <Loader />
// 	}
// )

export function MenuView({ institutionSlug }: MenuView) {
	const [type, setType, isLoading] = useLocalStorage<TypeView>({
		key: 'view-type',
		defaultValue: 'list'
	})
	const [weekOffset, setWeekOffset] = useState(0)
	const { startOfWeek, endOfWeek, datesOfWeek } = getDatesOfWeek(weekOffset)

	const {
		data,
		isLoading: isLoadingMenu,
		refetch
	} = useGetAllMenuItemQuery({
		startDate: startOfWeek,
		endDate: endOfWeek,
		institutionSlug
	} as MenuItemDataFilters)
	// const handleWeekChange = (direction: 'next' | 'prev') => {
	// 	setWeekOffset(prev => (direction === 'next' ? prev + 1 : prev - 1))
	// }
	useEffect(() => {
		refetch()
	}, [weekOffset, refetch])

	if (isLoading || isLoadingMenu) {
		return <Loader />
	}

	return (
		<div className={styles.menuWrapper}>
			{/* <SwitcherView
				setType={setType}
				type={type}
			/> */}
			{/* <div className={styles.btnWrapper}>
				<Button
					className='px-2 py-3 sm:px-4 sm:py-1'
					onClick={() => handleWeekChange('prev')}
				>
					Предыдущая неделя
				</Button>
				<Button
					className='px-2 py-3 sm:px-4 sm:py-1'
					onClick={() => handleWeekChange('next')}
				>
					Следующая неделя
				</Button>
			</div> */}
			<WeekChangeButtons setWeekOffset={setWeekOffset} />

			<ListView
				institutionSlug={institutionSlug}
				datesOfWeek={datesOfWeek}
			/>
			{/* <ListView /> */}
			{/* {type === 'list' ? <ListView /> : <KanbanView />} */}
		</div>
	)
}
