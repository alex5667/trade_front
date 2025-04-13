'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import WeekChangeButtonsWithDates from '@/components/ui/weekChangeButtonsWithDates/WeekChangeButtonsWithDates'

import { MenuItemDataFilters } from '@/types/menuItem.type'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useWeeklyNavigation } from '@/hooks/useWeeklyNavigation'

import { DatesOfWeek } from '@/utils/getDatesOfWeek'

import styles from './MenuView.module.scss'
import { ListView } from './list-view/ListView'
import { useGetInstitutionBySlugQuery } from '@/services/institution.service'
import {
	useCopyMenuItemMutation,
	useGetAllMenuItemQuery
} from '@/services/menu-item.service'

interface MenuViewProps {
	institutionSlug: string
}

export type TypeView = 'list' | 'kanban'

export function MenuView({ institutionSlug }: MenuViewProps) {
	const [type, setType, isLoading] = useLocalStorage<TypeView>({
		key: 'view-type',
		defaultValue: 'list'
	})

	const { weekOffset, startEndDate, queryArgs, changeWeek } =
		useWeeklyNavigation()
	const {
		weekOffset: weekOffsetForCopy,
		startEndDate: startEndDateForCopy,
		changeWeek: changeWeekForCopy
	} = useWeeklyNavigation()
	const [isVisible, setIsVisible] = useState(false)
	const { data: institution, isLoading: isLoadingInstitution } =
		useGetInstitutionBySlugQuery(institutionSlug)

	const {
		data,
		isLoading: isLoadingMenu,
		isFetching,
		refetch
	} = useGetAllMenuItemQuery(
		{
			startDate: startEndDate.startOfWeek,
			endDate: startEndDate.endOfWeek,
			institutionSlug
		} as MenuItemDataFilters,
		{ skip: !startEndDate.startOfWeek || !startEndDate.endOfWeek }
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

	if (
		isLoading ||
		isLoadingMenu ||
		isCopying ||
		isFetching ||
		isLoadingInstitution
	) {
		return <Loader />
	}

	return (
		<div className={styles.menuWrapper}>
			<div className={styles.headerSticky}>
				<h1>{institution?.name}</h1>
			</div>
			<div className={styles.weekChangeBtn}>
				<div className={styles.weekBtn}>
					<span>Выберите неделю</span>
					<WeekChangeButtonsWithDates
						weekOffset={weekOffset}
						onChangeWeek={changeWeek}
					/>
				</div>
				{isVisible && (
					<div className={styles.weekBtn}>
						<span>Выберите неделю для копирования</span>
						<WeekChangeButtonsWithDates
							weekOffset={weekOffsetForCopy}
							onChangeWeek={changeWeekForCopy}
						/>
					</div>
				)}
			</div>
			{isVisible && <Button onClick={handleCopy}>Копировать меню</Button>}
			{startEndDate.datesOfWeek && (
				<ListView
					institutionSlug={institutionSlug}
					datesOfWeek={startEndDate.datesOfWeek}
				/>
			)}
		</div>
	)
}
