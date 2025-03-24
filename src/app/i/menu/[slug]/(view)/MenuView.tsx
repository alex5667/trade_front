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

import {
	useCopyMenuItemMutation,
	useGetAllMenuItemQuery
} from '@/services/menu-item.service'
import styles from './MenuView.module.scss'
import { ListView } from './list-view/ListView'

interface MenuViewProps {
	institutionSlug: string
}

export type TypeView = 'list' | 'kanban'

export function MenuView({ institutionSlug }: MenuViewProps) {
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
		isFetching,
		refetch
	} = useGetAllMenuItemQuery(
		{
			startDate: startEndDate?.startOfWeek,
			endDate: startEndDate?.endOfWeek,
			institutionSlug
		} as MenuItemDataFilters,
		{ skip: !startEndDate?.startOfWeek || !startEndDate?.endOfWeek }
	)

	const [copyMenuItems, { isLoading: isCopying }] = useCopyMenuItemMutation()

	useEffect(() => {
		if (!data || data?.length === 0) {
			setIsVisible(true)
		} else {
			setIsVisible(false)
		}
	}, [data])

	const datesOfWeek = useMemo(
		() => startEndDate?.datesOfWeek || ({} as DatesOfWeek),
		[startEndDate?.datesOfWeek]
	)

	const handleSetStartEndDate: Dispatch<
		SetStateAction<StartEnDWeek | undefined>
	> = useCallback(dates => {
		if (typeof dates === 'function') {
			setStartEndDate(prevDates => {
				const newDates = dates(prevDates)
				return newDates
			})
			return
		}
		if (!dates || !dates.startOfWeek || !dates.endOfWeek) return
		setStartEndDate(dates)
	}, [])

	const handleSetStartEndDateForCopy = useCallback(
		(
			dates:
				| StartEnDWeek
				| undefined
				| ((prev: StartEnDWeek | undefined) => StartEnDWeek | undefined)
		) => {
			if (typeof dates === 'function') {
				setStartEndDateForCopy(prev => dates(prev))
			} else {
				if (!dates || !dates.startOfWeek || !dates.endOfWeek) return
				setStartEndDateForCopy(dates)
			}
		},
		[]
	)

	if (isLoading || isLoadingMenu || isCopying || isFetching) {
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
		</div>
	)
}
