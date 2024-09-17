'use client'

import DayWeek from '@/components/home/DayWeak'
import Loader from '@/components/ui/Loader'

import { DayOfWeekUkr } from '@/types/menuItem.type'
import { PageSlugParam } from '@/types/page-params'

import styles from './../../../HomePage.module.scss'
import { useGetByInstitutionSlugQuery } from '@/services/menu-item.service'

export default function MenuPage({ params }: PageSlugParam) {
	const { data, isLoading } = useGetByInstitutionSlugQuery(params.slug)

	const daysOfWeek = Object.keys(DayOfWeekUkr).filter(
		days => days !== 'SATURDAY' && days !== 'SUNDAY'
	)
	if (isLoading) return <Loader />
	return (
		<div className={styles.mainContent}>
			{daysOfWeek.map(day => {
				const daysWeekItems =
					(data && data.filter(item => item.dayOfWeek === day)) || []
				return (
					<DayWeek
						key={day}
						items={daysWeekItems}
						day={day}
					/>
				)
			})}
		</div>
	)
}
