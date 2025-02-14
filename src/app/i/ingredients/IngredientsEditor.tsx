'use client'

import { SetStateAction, useCallback, useState } from 'react'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { ActiveComponentType } from '@/components/сreator-editor/CreatorEditor'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import AliasInput from './AliasInput'
import {
	useDeleteAliasMutation,
	useGetAliasesByIngredientNameQuery
} from '@/services/ingredient-alias.service'
import { useUpdateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsEditorProps {
	initialIngredient: IngredientResponse
	setActiveComponent?: (value: SetStateAction<ActiveComponentType>) => void
}
const IngredientsEditor = ({ initialIngredient }: IngredientsEditorProps) => {
	const [ingredient, setIngredient] = useState<IngredientResponse | null>(
		initialIngredient
	)
	const [aliases, setAliases] = useState(ingredient?.aliases)
	const [update, { isSuccess }] = useUpdateIngredientMutation()

	const { isLoading } = useGetAliasesByIngredientNameQuery(
		(ingredient?.name ?? '') as string,
		{ skip: !ingredient?.name }
	)
	const [deleteAlias] = useDeleteAliasMutation()

	// const aliasesState = useTypedSelector(
	// 	state => state.ingredientAliasSlice.items
	// )

	const memoizedSetIngredient = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredient(value)
		},
		[]
	)

	const handleSave = () => {}
	// const { addAliasIngredient } = useActions()
	// const addAlias = useCallback(async () => {
	// 	if (!ingredient?.id) return
	// 	addAliasIngredient({
	// 		id: 0,
	// 		ingredientId: ingredient?.id,
	// 		alias: 'Введи синоним'
	// 	})
	// }, [addAliasIngredient, ingredient?.id])

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
			{aliases && ingredient?.name && !isLoading && (
				<div className='flex flex-col w-[70%]'>
					<span>Синонимы</span>
					<Button
						className='ml-2'
						onClick={addAlias}
					>
						Добавить
					</Button>
					{aliases.map((alias: IngredientAliasResponse) => (
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
								<Button
									onClick={() => deleteAlias(alias.id)}
									className='ml-2'
								>
									Удалить
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
			<Button onClick={handleSave}>Сохранить зменения</Button>
		</div>
	)
}

export default IngredientsEditor
