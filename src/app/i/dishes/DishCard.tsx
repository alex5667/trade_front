import { Loader } from 'lucide-react'
import { SetStateAction, memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { Checkbox } from '@/components/ui/checkbox/Checkbox'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { Titlies } from '@/constants/titles'

import { DishFormState, DishResponse } from '@/types/dish.type'
import { DishCategoryResponse } from '@/types/dishCategory.type'

import DishAliases from './DishAliases'
import DishIngredients from './DishIngredients'
import DishInput from './DishInput'
import { DishUpdate, useUpdateDishMutation } from '@/services/dish.service'

interface DishCardProps {
	dish: DishFormState
}

const DishCard = memo(({ dish: initialDish }: DishCardProps) => {
	const [dish, setDish] = useState<DishFormState>(() => {
		// Ensure aliases exists with default empty array if not provided
		return {
			...initialDish,
			aliases: initialDish.aliases || []
		}
	})
	console.log('DishCard', JSON.stringify(dish, null, 2))

	const [category, setCategory] = useState<DishCategoryResponse | null>(null)
	const [updateDish, { isLoading }] = useUpdateDishMutation()

	// Синхронизация с пропсами только при монтировании или если initialDish изменился извне
	useEffect(() => {
		setDish({
			...initialDish,
			aliases: initialDish.aliases || dish.aliases || []
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialDish])

	// Отправка обновлений на сервер при изменении category
	useEffect(() => {
		if (dish && dish.id && category) {
			const dishUpdate: DishUpdate = {
				data: { ...dish, category },
				id: dish.id
			}
			updateDish(dishUpdate).then(response => {
				console.log('Update response (category):', response)
			})
		}
	}, [category, dish, updateDish])

	const memoizedSetDish = useCallback(
		(value: SetStateAction<DishFormState>) => {
			setDish(value)
		},
		[]
	)

	const handleCheckboxChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			if (!dish.id) return

			const dishUpdate: DishUpdate = {
				data: { ...dish, isSemiFinished: e.target.checked },
				id: dish.id
			}
			const response = await updateDish(dishUpdate).unwrap()

			if (response) {
				setDish(response)
			}
		},
		[dish, updateDish]
	)

	// Сохранение изменений
	const handleSave = async () => {
		console.log('dish', JSON.stringify(dish, null, 2))
		if (!dish || !dish.id) {
			toast.error('Блюдо не выбрано')
			return
		}

		try {
			const dishUpdate: DishUpdate = {
				data: {
					...dish,
					aliases: dish.aliases || [], // Ensure aliases is always an array
					category: category || dish.category // Use the current category state
				},
				id: dish.id
			}
			console.log('dishUpdate', dishUpdate)
			const response = await updateDish(dishUpdate).unwrap()
			console.log('response', response)

			if (response) {
				setDish({
					...response,
					aliases: response.aliases || dish.aliases || [] // Preserve aliases from response or current state
				})
				toast.success('Блюдо успешно обновлено')
			}
		} catch (error) {
			console.error('Ошибка при обновлении блюда:', error)
			toast.error('Ошибка при обновлении блюда')
		}
	}

	if (!dish || Object.keys(dish).length === 0) {
		return <p>Блюдо не выбрано.</p>
	}
	if (isLoading) {
		return <Loader />
	}

	return (
		<div className='w-full flex flex-col gap-2 mt-5'>
			<Button
				onClick={handleSave}
				disabled={isLoading}
				className='mb-4'
			>
				{isLoading ? 'Сохранение...' : 'Сохранить изменения'}
			</Button>
			<div className=''>
				{(Object.keys(dish) as (keyof DishResponse)[]).map((key, index) => {
					// Skip aliases as we're already rendering it separately
					if (key === 'aliases') {
						return null
					}
					if (key === 'ingredients') {
						return (
							<DishIngredients
								key={index}
								dish={dish}
								setDish={memoizedSetDish}
							/>
						)
					}
					if (key === 'category') {
						return (
							<div
								key={index}
								className='flex w-full items-center justify-between'
							>
								<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
									{Titlies[key]}
								</p>
								<SimpleAutocompleteInput<DishCategoryResponse>
									fetchFunction='dishCategory'
									setItem={setCategory}
									isVisibleCard={false}
									item={dish.category}
								/>
							</div>
						)
					}
					if (key === 'isSemiFinished') {
						return (
							<div
								key={index}
								className='flex w-full items-center justify-between'
							>
								<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
									{Titlies[key] || key}
								</p>
								<Checkbox
									id={key}
									checked={dish.isSemiFinished}
									onChange={handleCheckboxChange}
								/>
							</div>
						)
					}
					return (
						<div
							key={index}
							className='flex w-full items-center justify-between'
						>
							<p className='mr-2 p-2 text-sm rounded-lg border border-border-light flex-grow w-[20%] h-full'>
								{Titlies[key] || key}
							</p>
							<DishInput
								dish={dish}
								keyName={key}
								setDish={memoizedSetDish}
							/>
						</div>
					)
				})}
				<DishAliases
					dish={dish}
					setDish={memoizedSetDish}
				/>
			</div>
		</div>
	)
})

const areEqual = (
	prevProps: DishCardProps,
	nextProps: DishCardProps
): boolean => {
	return JSON.stringify(prevProps.dish) === JSON.stringify(nextProps.dish)
}

DishCard.displayName = 'DishCard'
export default memo(DishCard, areEqual)
