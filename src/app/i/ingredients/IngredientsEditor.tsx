'use client'

import { SetStateAction, useCallback, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { SimpleField } from '@/components/ui/fields/SImpleField'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { ActiveComponentType } from '@/components/сreator-editor/CreatorEditor'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import { errorCatch } from '@/api/error'

import { useUpdateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsEditorProps {
	initialIngredient?: IngredientResponse
	setActiveComponent?: (value: SetStateAction<ActiveComponentType>) => void
}
const IngredientsEditor = ({ initialIngredient }: IngredientsEditorProps) => {
	const [ingredient, setIngredient] = useState<IngredientResponse | null>(
		initialIngredient ? initialIngredient : null
	)
	const [aliases, setAliases] = useState<IngredientAliasResponse[] | undefined>(
		ingredient?.aliases ?? []
	)
	const [update, { isSuccess }] = useUpdateIngredientMutation()

	// const { isLoading } = useGetAliasesByIngredientNameQuery(
	// 	(ingredient?.name ?? '') as string,
	// 	{ skip: !ingredient?.name }
	// )

	const memoizedSetIngredient = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredient(value)
		},
		[]
	)

	const addAlias = () => {
		if (ingredient?.id) {
			const newAlias: IngredientAliasResponse = {
				id: Date.now(),
				ingredientId: ingredient && ingredient?.id,
				alias: 'Введи синоним'
			}
			setAliases(prev => [...(prev ?? []), newAlias])
		}
	}
	const deleteAlias = (id: string | number) => {
		const filterdAliases = aliases?.filter(alias => alias.id !== id)
		setAliases(() => [...(filterdAliases ?? [])])
	}

	const handleChange =
		(id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setAliases(prev =>
				prev
					? prev.map(alias =>
							alias.id === id ? { ...alias, alias: e.target.value } : alias
						)
					: []
			)
		}

	const handleSave = async () => {
		const updatedIngredient = { ...ingredient, aliases }
		if (ingredient?.id) {
			try {
				const responseIngredient = await update({
					id: ingredient?.id,
					data: updatedIngredient
				}).unwrap()
				if (isSuccess) {
					setIngredient(responseIngredient)
				}
			} catch (error) {
				toast.error(errorCatch(error))
			}
		}
	}
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
			{aliases && ingredient?.name && (
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
								<SimpleField
									id='alias'
									label='Наименование'
									placeholder='Введите наименование'
									onChange={handleChange(alias.id)}
									type='text'
								/>
								{/* <AliasInput
									aliasItem={alias}
									aliasKey={alias.id}
									ingredient={ingredient}
									setIngredient={memoizedSetIngredient}
								/> */}
								<Button
									onClick={() => deleteAlias(alias?.id)}
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
