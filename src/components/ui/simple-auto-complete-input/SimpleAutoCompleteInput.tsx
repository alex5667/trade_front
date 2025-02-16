'use client'

import cn from 'clsx'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useOutside } from '@/hooks/useOutside'

import { errorCatch } from '@/api/error'

import Card from '../card/Card'
import AutoCompleteTextarea from '../fields/auto-complete-input/AutoCompleteTextarea'
import { useAutocompleteInput } from '../fields/hooks/useAutocompleteInput'

import styles from './SimpleAutocompleteInput.module.scss'
import { SimpleAutocompleteList } from './SimpleAutocompleteList'
import { useSimpleOptionSelect } from './useSimpleOptionSelect'
import { useGetDishCategoryByNameQuery } from '@/services/dish-category.service'
import { useGetIngredientByNameQuery } from '@/services/ingredient.service'
import { useGetInstitutionByNameQuery } from '@/services/institution.service'
import { useGetMealByNameQuery } from '@/services/meal.service'

const fetchQueries = {
	institution: useGetInstitutionByNameQuery,
	meal: useGetMealByNameQuery,
	dishCategory: useGetDishCategoryByNameQuery,
	ingredient: useGetIngredientByNameQuery
}

type SimpleAutocompleteInputProps<T extends { id: number; name: string }> = {
	fetchFunction: keyof typeof fetchQueries
	className?: string
	setItem?: (value: SetStateAction<T | null>) => void
	item?: T | null
	isVisibleCard?: boolean
	style?: React.CSSProperties // Добавляем поддержку стилей
}

export const SimpleAutocompleteInput = <
	T extends { id: number; name: string }
>({
	className,
	fetchFunction,
	setItem: setItemToParent,
	item: parentItem,
	isVisibleCard = true
}: SimpleAutocompleteInputProps<T>): JSX.Element => {
	const inputRef = useRef<HTMLTextAreaElement>(null)
	const { isShow, ref, setIsShow } = useOutside(false)
	const [item, setItem] = useState<T | null>(parentItem?.id ? parentItem : null)
	useEffect(() => {
		if (parentItem) setItem(parentItem)
	}, [parentItem])

	useEffect(() => {
		if (setItemToParent) {
			setItemToParent(prev => {
				const prevObj = prev ?? ({} as T)
				const newObj = item ?? ({} as T)
				// Если объекты равны, ничего не меняем
				if (JSON.stringify(prevObj) === JSON.stringify(newObj)) {
					return prev
				}
				return { ...prevObj, ...newObj }
			})
		}
	}, [setItemToParent, item])

	const {
		inputValue,
		handleChange,
		debouncedValue,
		shouldFetch,
		setShouldFetch,
		setDebouncedValue,
		setInputValue
	} = useAutocompleteInput({ setIsShow })

	useEffect(() => {
		if (parentItem) {
			setInputValue(parentItem.name)
		}
	}, [parentItem, setInputValue])

	const queryHook = fetchQueries[fetchFunction]
	const { data, isError, error } = queryHook(debouncedValue, {
		skip: !shouldFetch || !debouncedValue.trim()
	})

	if (isError) {
		toast.error(errorCatch(error))
	}

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
					fetchFunction={fetchFunction}
					setItemToParent={setItemToParent}
				/>
			)}
		</div>
	)
}

SimpleAutocompleteInput.displayName = 'SimpleAutocompleteInput'
