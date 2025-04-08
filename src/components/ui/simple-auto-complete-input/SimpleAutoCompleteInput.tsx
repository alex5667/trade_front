'use client'

import cn from 'clsx'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { DishResponse } from '@/types/dish.type'
import { DishCategoryResponse } from '@/types/dishCategory.type'
import { IngredientResponse } from '@/types/ingredient.type'
import { InstitutionResponse } from '@/types/institution.type'
import { MealResponse } from '@/types/meal.type'
import { WarehouseResponse } from '@/types/warehouse.type'

import { useOutside } from '@/hooks/useOutside'

import { errorCatch } from '@/api/error'

import Card from '../card/Card'
import AutoCompleteTextarea from '../fields/auto-complete-input/AutoCompleteTextarea'
import { useAutocompleteInput } from '../fields/hooks/useAutocompleteInput'

import styles from './SimpleAutocompleteInput.module.scss'
import { SimpleAutocompleteList } from './SimpleAutocompleteList'
import { useSimpleOptionSelect } from './useSimpleOptionSelect'
import { useGetDishAliasByNameQuery } from '@/services/dish-alias.service'
import { useGetDishCategoryByNameQuery } from '@/services/dish-category.service'
import { useGetDishByNameQuery } from '@/services/dish.service'
import { useGetIngredientByNameQuery } from '@/services/ingredient.service'
import { useGetInstitutionByNameQuery } from '@/services/institution.service'
import { useGetMealByNameQuery } from '@/services/meal.service'
import { useGetWarehouseByNameQuery } from '@/services/warehouse.service'

export type EntityType =
	| InstitutionResponse
	| MealResponse
	| IngredientResponse
	| DishCategoryResponse
	| WarehouseResponse
	| DishResponse

const fetchQueries = {
	institution: useGetInstitutionByNameQuery,
	meal: useGetMealByNameQuery,
	dishCategory: useGetDishCategoryByNameQuery,
	ingredient: useGetIngredientByNameQuery,
	warehouse: useGetWarehouseByNameQuery,
	dish: useGetDishByNameQuery,
	dishAlias: useGetDishAliasByNameQuery
}

type FetchQueryKey = keyof typeof fetchQueries

type SimpleAutocompleteInputProps<T extends EntityType> = {
	fetchFunction: FetchQueryKey
	className?: string
	setItem?: (value: SetStateAction<T | null>) => void
	item?: T | null
	isVisibleCard?: boolean
	style?: React.CSSProperties
}

export const SimpleAutocompleteInput = <T extends EntityType>({
	className,
	fetchFunction,
	setItem: setItemToParent,
	item: parentItem,
	isVisibleCard = true,
	style
}: SimpleAutocompleteInputProps<T>): JSX.Element => {
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const { isShow, ref, setIsShow } = useOutside(false)
	const [item, setItem] = useState<T | null>(parentItem?.id ? parentItem : null)

	// Сохраняем предыдущее значение, чтобы избежать лишних ререндеров
	const prevItemRef = useRef<T | null>(null)

	// Обновляем `item`, если `parentItem` изменился
	useEffect(() => {
		if (parentItem && parentItem !== prevItemRef.current) {
			setItem(parentItem)
			prevItemRef.current = parentItem
		}
	}, [parentItem])

	// Обновляем `setItemToParent`, если `item` изменилось
	useEffect(() => {
		if (setItemToParent && prevItemRef.current !== item) {
			prevItemRef.current = item
			setItemToParent(item)
		}
	}, [setItemToParent, item])

	// Управление вводом
	const {
		inputValue,
		handleChange,
		debouncedValue,
		shouldFetch,
		setShouldFetch,
		setDebouncedValue,
		setInputValue
	} = useAutocompleteInput({ setIsShow })

	// При изменении `parentItem` обновляем поле ввода
	useEffect(() => {
		if (parentItem) {
			setInputValue(parentItem.name)
		}
	}, [parentItem, setInputValue])

	// Добавляем задержку перед включением `shouldFetch`, чтобы не делать запросы при каждом символе
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setShouldFetch(!!debouncedValue.trim())
		}, 300) // 300мс задержка

		return () => clearTimeout(timeoutId) // Очищаем таймер перед следующим обновлением
	}, [debouncedValue, setShouldFetch])

	// Отключаем запрос, если выпадающий список скрыт
	useEffect(() => {
		if (!isShow) {
			setShouldFetch(false)
		}
	}, [isShow, setShouldFetch])

	// Вызываем все хуки статически
	const institutionQuery = useGetInstitutionByNameQuery(debouncedValue, {
		skip:
			fetchFunction !== 'institution' || !shouldFetch || !debouncedValue.trim()
	})
	const mealQuery = useGetMealByNameQuery(debouncedValue, {
		skip: fetchFunction !== 'meal' || !shouldFetch || !debouncedValue.trim()
	})
	const dishCategoryQuery = useGetDishCategoryByNameQuery(debouncedValue, {
		skip:
			fetchFunction !== 'dishCategory' || !shouldFetch || !debouncedValue.trim()
	})
	const ingredientQuery = useGetIngredientByNameQuery(debouncedValue, {
		skip:
			fetchFunction !== 'ingredient' || !shouldFetch || !debouncedValue.trim()
	})
	const warehouseQuery = useGetWarehouseByNameQuery(debouncedValue, {
		skip:
			fetchFunction !== 'warehouse' || !shouldFetch || !debouncedValue.trim()
	})

	const dishQuery = useGetDishByNameQuery(debouncedValue, {
		skip: fetchFunction !== 'dish' || !shouldFetch || !debouncedValue.trim()
	})

	const dishAliasQuery = useGetDishAliasByNameQuery(debouncedValue, {
		skip:
			fetchFunction !== 'dishAlias' || !shouldFetch || !debouncedValue.trim()
	})

	// Выбираем нужный результат в зависимости от fetchFunction
	const queryResult =
		fetchFunction === 'institution'
			? institutionQuery
			: fetchFunction === 'meal'
				? mealQuery
				: fetchFunction === 'dishCategory'
					? dishCategoryQuery
					: fetchFunction === 'ingredient'
						? ingredientQuery
						: fetchFunction === 'dish'
							? dishQuery
							: fetchFunction === 'dishAlias'
								? dishAliasQuery
								: warehouseQuery

	const { data, isError, error } = queryResult

	useEffect(() => {
		if (isError) {
			toast.error(errorCatch(error))
		}
	}, [isError, error])

	// Обработчик выбора элемента
	const handleOptionSelect = useSimpleOptionSelect(
		setInputValue,
		setDebouncedValue,
		setShouldFetch,
		setIsShow,
		inputRef,
		setItem as (value: SetStateAction<T>) => void
	)

	return (
		<div className={cn(styles.autocompleteContainer, className)}>
			<div className='w-full relative'>
				<AutoCompleteTextarea
					ref={inputRef}
					setIsShow={setIsShow}
					handleChange={handleChange}
					inputValue={inputValue}
				/>
				{isShow && data && data.length > 0 && (
					<SimpleAutocompleteList
						ref={ref}
						data={data}
						handleOptionSelect={item => handleOptionSelect(item as T)}
					/>
				)}
			</div>

			{item && isVisibleCard && (
				<Card
					item={item}
					fetchFunction={fetchFunction as FetchQueryKey}
					setItemToParent={setItemToParent}
				/>
			)}
		</div>
	)
}

SimpleAutocompleteInput.displayName = 'SimpleAutocompleteInput'
