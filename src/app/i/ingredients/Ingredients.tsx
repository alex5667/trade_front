'use client'

import { SetStateAction, useCallback, useState } from 'react'

import Loader from '@/components/ui/Loader'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import { useActions } from '@/hooks/useActions'
import { useTypedSelector } from '@/hooks/useTypedSelector'

import AliasInput from './AliasInput'
import {
	useDeleteAliasMutation,
	useGetAliasesByIngredientNameQuery
} from '@/services/ingredient-alias.service'

const Ingredients = () => {
	const [ingredient, setIngredient] = useState<IngredientResponse | null>(null)
	const { isLoading } = useGetAliasesByIngredientNameQuery(
		(ingredient?.name ?? '') as string,
		{ skip: !ingredient?.name }
	)
	const [deleteAlias] = useDeleteAliasMutation()

	const aliasesState = useTypedSelector(
		state => state.ingredientAliasSlice.items
	)

	const memoizedSetIngredient = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredient(value)
		},
		[]
	)

	const { addAliasIngredient } = useActions()
	const addAlias = useCallback(async () => {
		if (!ingredient?.id) return
		addAliasIngredient({
			id: 0,
			ingredientId: ingredient?.id,
			alias: 'Введи синоним'
		})
	}, [addAliasIngredient, ingredient?.id])

	return (
		<div className='flex flex-col relative'>
			<span>Введите наименование</span>
			<SimpleAutocompleteInput<IngredientResponse>
				fetchFunction='ingredient'
				className='flex w-[70%] flex-col items-start'
				setItem={memoizedSetIngredient}
				item={ingredient?.name ? ingredient : undefined}
			/>
			{isLoading && <Loader />}
			{aliasesState && ingredient?.name && !isLoading && (
				<div className='flex flex-col w-[70%]'>
					<span>Синонимы</span>
					<button
						className='ml-2'
						onClick={addAlias}
					>
						Добавить
					</button>
					{aliasesState.map((alias: IngredientAliasResponse) => (
						<div
							key={alias.id}
							className='flex flex-col items-center'
						>
							<div>
								<AliasInput
									aliasItem={alias}
									aliasKey={alias.id}
									ingredient={ingredient}
									setIngredient={memoizedSetIngredient}
								/>
								<button
									onClick={() => deleteAlias(alias.id)}
									className='ml-2'
								>
									Удалить
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Ingredients
