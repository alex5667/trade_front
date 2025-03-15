'use client'

import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react'
import { toast } from 'sonner'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import WeekChangeButtonsWithDates, {
	StartEnDWeek
} from '@/components/ui/weekChangeButtonsWithDates/WeekChangeButtonsWithDates'

import { MenuItemDataFilters } from '@/types/menuItem.type'

import { useLocalStorage } from '@/hooks/useLocalStorage'

import { DatesOfWeek } from '@/utils/getDatesOfWeek'

import styles from './MenuView.module.scss'
import { ListView } from './list-view/ListView'
import {
	useCopyMenuItemMutation,
	useGetAllMenuItemQuery
} from '@/services/menu-item.service'

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

	const [startEndDate, setStartEndDate] = useState<StartEnDWeek | undefined>()
	const [startEndDateForCopy, setStartEndDateForCopy] = useState<
		StartEnDWeek | undefined
	>()

	const [isVisible, setIsVisible] = useState(false)
	const {
		data,
		isLoading: isLoadingMenu,
		refetch
	} = useGetAllMenuItemQuery(
		{
			startDate: startEndDate?.startOfWeek,
			endDate: startEndDate?.endOfWeek,
			institutionSlug
		} as MenuItemDataFilters,
		{
			skip: !startEndDate?.startOfWeek || !startEndDate?.endOfWeek
		}
	)

	const [copyMenuItems, { isLoading: isCopying }] = useCopyMenuItemMutation()

	useEffect(() => {
		if (!data || data?.length === 0) {
			setIsVisible(true)
		} else {
			setIsVisible(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.length])

	const datesOfWeek = useMemo(
		() => startEndDate?.datesOfWeek || ({} as DatesOfWeek),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[startEndDate?.datesOfWeek, startEndDateForCopy?.datesOfWeek]
	)
	const handleSetStartEndDate: Dispatch<
		SetStateAction<StartEnDWeek | undefined>
	> = useCallback(dates => {
		if (typeof dates === 'function') {
			return
		}
		if (!dates || !dates.startOfWeek || !dates.endOfWeek) return

		setStartEndDate(dates)
	}, [])
	useEffect(() => {
		if (startEndDate?.startOfWeek && startEndDate?.endOfWeek) {
			refetch()
		}
	}, [startEndDate, refetch])

	const handleSetStartEndDateForCopy: Dispatch<
		SetStateAction<StartEnDWeek | undefined>
	> = useCallback(dates => setStartEndDateForCopy(dates), [])

	if (isLoading || isLoadingMenu || isCopying) {
		return <Loader />
	}

	const handleCopy = async () => {
		if (startEndDate && startEndDateForCopy) {
			try {
				await copyMenuItems({
					startDate: startEndDate.startOfWeek,
					endDate: startEndDate.endOfWeek,
					startDateForCopy: startEndDateForCopy.startOfWeek,
					endDateForCopy: startEndDateForCopy.endOfWeek,
					institutionSlug
				}).unwrap()
				toast.success('Successfully copied menu!')
			} catch {
				toast.error('Error copying menu!')
			}
		}
	}

	return (
		<div className={styles.menuWrapper}>
			{/* <SwitcherView
				setType={setType}
				type={type}
			/> */}

			<div className={styles.weekChangeBtn}>
				<div className={styles.weekBtn}>
					<span>Выберите неделю</span>
					<WeekChangeButtonsWithDates setStartEndDate={handleSetStartEndDate} />
				</div>
				{isVisible && (
					<div className={styles.weekBtn}>
						<span>Выберите неделю для копирования</span>
						<WeekChangeButtonsWithDates
							setStartEndDate={handleSetStartEndDateForCopy}
						/>
					</div>
				)}
			</div>
			{isVisible && <Button onClick={handleCopy}>Копировать меню</Button>}
			{startEndDate?.datesOfWeek && (
				<ListView
					institutionSlug={institutionSlug}
					datesOfWeek={datesOfWeek}
				/>
			)}

			{/* <ListView /> */}
			{/* {type === 'list' ? <ListView /> : <KanbanView />} */}
		</div>
	)
}
