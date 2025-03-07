import cn from 'clsx'
import { GripVertical, Loader, Trash } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

import { FieldInput } from '@/components/ui/fields/FieldInput'
import { AutocompleteInput } from '@/components/ui/fields/auto-complete-input/AutocompleteInput'

import { DishResponse } from '@/types/dish.type'
import { MealResponse } from '@/types/meal.type'
import { MenuItemResponse } from '@/types/menuItem.type'

import styles from './ListView.module.scss'
import {
	useDeleteMenuItemMutation,
	useUpdateMenuItemMutation
} from '@/services/menu-item.service'

interface ListRowProps {
	item: MenuItemResponse
	institutionSlug: string
	mealSlug: string
	dateForDay: string
}

const ListRow = ({
	item,
	institutionSlug,
	mealSlug,
	dateForDay
}: ListRowProps) => {
	const [menuItem, setMenuItem] = useState<MenuItemResponse>(() => item)
	console.log('first', menuItem)
	useEffect(() => {
		setMenuItem(item) // Просто обновляем state при изменении item
	}, [item])
	const [deleteMenuItem, { isLoading }] = useDeleteMenuItemMutation()
	const [updateItem] = useUpdateMenuItemMutation()
	return (
		<div className={cn(styles.row)}>
			<div className={styles.transparentContainer}>
				<button aria-describedby='todo-item'>
					<GripVertical className={styles.grip} />
				</button>

				<AutocompleteInput
					institutionSlug={institutionSlug}
					mealSlug={mealSlug}
					item={item}
					dateForDay={dateForDay}
					isMenuItem={true}
				/>
			</div>
			<FieldInput
				id='outputWeight'
				isNumber={true}
				placeholder={''}
				value={menuItem.outputWeight ?? ''}
				onChange={e => {
					const newValue = Number(e.target.value) || 0
					setMenuItem(prev => ({ ...prev, outputWeight: newValue }))
				}}
			/>
			{item.id && (
				<button
					onClick={() => deleteMenuItem(item.id!)}
					className={styles.deleteButton}
				>
					{isLoading ? <Loader size={17} /> : <Trash size={17} />}
				</button>
			)}
		</div>
	)
}

const areEqual = (prevProps: ListRowProps, nextProps: ListRowProps) => {
	const prevMealIsString = typeof prevProps.item.meal === 'string'
	const nextMealIsString = typeof nextProps.item.meal === 'string'

	const prevMealPrintName = prevMealIsString
		? prevProps.item.meal
		: (prevProps.item.meal as MealResponse)?.printName
	const nextMealPrintName = nextMealIsString
		? nextProps.item.meal
		: (nextProps.item.meal as MealResponse)?.printName

	const prevDishIsString = typeof prevProps.item.dish === 'string'
	const nextDishIsString = typeof nextProps.item.dish === 'string'

	const prevDishPrintName = prevDishIsString
		? prevProps.item.dish
		: (prevProps.item.dish as DishResponse)?.printName
	const nextDishPrintName = nextDishIsString
		? nextProps.item.dish
		: (nextProps.item.dish as DishResponse)?.printName

	return (
		prevProps.item.id === nextProps.item.id &&
		prevProps.item.createdAt === nextProps.item.createdAt &&
		prevProps.item.updatedAt === nextProps.item.updatedAt &&
		prevProps.item.date === nextProps.item.date &&
		prevMealPrintName === nextMealPrintName &&
		prevDishPrintName === nextDishPrintName &&
		prevProps.item.price === nextProps.item.price &&
		prevProps.item.dishOrder === nextProps.item.dishOrder &&
		prevProps.item.description === nextProps.item.description &&
		prevProps.item.institution === nextProps.item.institution
	)
}

export default memo(ListRow, areEqual)
