import { useEffect, useState } from 'react'

import Loader from '@/components/ui/Loader'

import { MealConsumptionResponse } from '@/types/mealConsumption.type'

import { useTypedSelector } from '@/hooks/useTypedSelector'

import styles from './ConsumptionPage.module.scss'
import MealRow from './MealRow'

interface MealParentProps {
	label: string
	mealSlug: string
	dateForDay: string
}

const MealParent = ({ label, mealSlug, dateForDay }: MealParentProps) => {
	const institutions = useTypedSelector(state => state.institutionSlice.items)
	const items = useTypedSelector(state => state.mealConsumptionSlice.items)
	const [quantity, setQuantity] = useState(0)
	const [filteredItems, setFilteredItems] = useState<
		MealConsumptionResponse[] | []
	>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsLoading(true)

		const filteredItems: MealConsumptionResponse[] = items.filter(
			item =>
				item.date === dateForDay && item.meal && item.meal.slug === mealSlug
		)
		const quantity = filteredItems.reduce((acc, curr) => {
			return acc + (curr.quantity || 0)
		}, 0)

		setFilteredItems(filteredItems)
		setQuantity(quantity)
		setIsLoading(false)
	}, [dateForDay, items, mealSlug])

	return (
		<div className='flex flex-col items-center justify-start w-full'>
			<h4 className={styles.colHeading}>{label}</h4>

			{isLoading ? (
				<Loader />
			) : (
				<>
					{institutions &&
						institutions.length > 0 &&
						institutions.map(institution => {
							const consumptionItem = filteredItems.find(item => {
								return item.institution?.slug === institution.slug
							})

							return (
								<MealRow
									institutionSlug={institution.slug}
									institutionName={institution.printName}
									key={institution.id}
									dateForDay={dateForDay}
									mealSlug={mealSlug}
									consumptionItem={consumptionItem}
								/>
							)
						})}
					<div className='flex min-w-full'>
						<div className='text-base w-[50%] bg-db-row-light border border-border-light py-2 px-3'>
							Итого:
						</div>
						<div className='text-base w-[50%] text-center bg-db-row-light/50 border border-border-light py-2 px-3 '>
							{quantity}
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default MealParent
