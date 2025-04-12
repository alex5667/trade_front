import cn from 'clsx'
import { GripVertical, Loader, Trash } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { FieldInput } from '@/components/ui/fields/FieldInput'
import { AutocompleteInput } from '@/components/ui/fields/auto-complete-input/AutocompleteInput'

import { MenuItemResponse, UpdateMenuDto } from '@/types/menuItem.type'

import { debounce } from '@/utils/debounce'

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
	const [menuItem, setMenuItem] = useState<MenuItemResponse>(item)
	const prevValues = useRef({
		outputWeight: item.outputWeight,
		relativePercentage: item.relativePercentage
	})
	const [deleteMenuItem, { isLoading: isDeleting }] =
		useDeleteMenuItemMutation()
	const [updateItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation()

	// Синхронизация с пропсами только при их изменении
	useEffect(() => {
		setMenuItem(item)
		prevValues.current = {
			outputWeight: item.outputWeight,
			relativePercentage: item.relativePercentage
		}
	}, [item])

	// Оптимизированный debounced update
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedUpdate = useCallback(
		debounce((id: number, data: UpdateMenuDto) => {
			updateItem({ id, data })
				.unwrap()
				.catch(() => {
					toast.error('Failed to update menu item!')
				})
		}, 600),
		[updateItem]
	)

	useEffect(() => {
		if (
			item.id &&
			!isUpdating && // Исключаем лишние запросы
			(prevValues.current.outputWeight !== menuItem.outputWeight ||
				prevValues.current.relativePercentage !== menuItem.relativePercentage)
		) {
			const updatedItem = {
				outputWeight: menuItem.outputWeight,
				relativePercentage: menuItem.relativePercentage,
				mealId:
					typeof menuItem.meal === 'string'
						? +menuItem.meal
						: +menuItem.meal.id,
				dayOfWeek: menuItem.dayOfWeek,
				date: menuItem.date,
				dishId:
					typeof menuItem.dish === 'string'
						? +menuItem.dish
						: +menuItem.dish?.id,
				description: menuItem.description,
				institutionId:
					typeof menuItem.institution === 'string'
						? +menuItem.institution
						: +menuItem.institution.id,
				price: menuItem.price,
				dishOrder: menuItem.dishOrder
			}

			debouncedUpdate(item.id, updatedItem)
			prevValues.current = {
				outputWeight: menuItem.outputWeight,
				relativePercentage: menuItem.relativePercentage
			} // Обновляем референс
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		item.id,
		menuItem.outputWeight,
		menuItem.relativePercentage,
		debouncedUpdate,
		isUpdating
	])

	// Обработчик удаления с обработкой ошибок
	const handleDelete = useCallback(() => {
		if (item.id) {
			deleteMenuItem(item.id)
				.unwrap()
				.catch(() => {
					toast.error('Failed to delete menu item!')
				})
		}
	}, [item.id, deleteMenuItem])

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
			<div className={styles.rowInputs}>
				<FieldInput
					id='outputWeight'
					isNumber={true}
					placeholder='выход'
					value={menuItem.outputWeight ?? ''}
					onChange={e => {
						const newValue = Number(e.target.value) || 0
						setMenuItem(prev => ({ ...prev, outputWeight: newValue }))
					}}
					disabled={isUpdating}
					extra='mr-2 border  border-db-border-light rounded-sm'
					style={{ fontSize: '14px' }}
				/>
				<FieldInput
					id='relativePercentage'
					isNumber={true}
					placeholder='%'
					extra='border  border-db-border-light rounded-sm'
					value={menuItem.relativePercentage ?? ''}
					onChange={e => {
						const newValue = Number(e.target.value) || 0
						setMenuItem(prev => ({ ...prev, relativePercentage: newValue }))
					}}
					disabled={isUpdating}
					style={{ fontSize: '14px' }}
				/>
				{item.id && (
					<button
						onClick={handleDelete}
						className={styles.deleteButton}
						disabled={isDeleting}
					>
						{isDeleting ? <Loader size={17} /> : <Trash size={17} />}
					</button>
				)}
			</div>
		</div>
	)
}

// Оптимизированная функция сравнения для memo
const areEqual = (prevProps: ListRowProps, nextProps: ListRowProps) => {
	const getId = (val: string | { id: number }) =>
		typeof val === 'string' ? val : val.id

	return (
		prevProps.item.id === nextProps.item.id &&
		prevProps.item.createdAt === nextProps.item.createdAt &&
		prevProps.item.updatedAt === nextProps.item.updatedAt &&
		prevProps.item.date === nextProps.item.date &&
		getId(prevProps.item.meal) === getId(nextProps.item.meal) &&
		getId(prevProps.item.dish) === getId(nextProps.item.dish) &&
		prevProps.item.price === nextProps.item.price &&
		prevProps.item.dishOrder === nextProps.item.dishOrder &&
		prevProps.item.description === nextProps.item.description &&
		prevProps.item.institution === nextProps.item.institution &&
		prevProps.item.outputWeight === nextProps.item.outputWeight &&
		prevProps.item.relativePercentage === nextProps.item.relativePercentage &&
		prevProps.institutionSlug === nextProps.institutionSlug &&
		prevProps.mealSlug === nextProps.mealSlug &&
		prevProps.dateForDay === nextProps.dateForDay
	)
}

export default memo(ListRow, areEqual)
