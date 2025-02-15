'use client'

import { SetStateAction, useCallback, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { ActiveComponentProps } from '@/components/сreator-editor/CreatorEditor'

import {
	IngredientAliasFormState,
	IngredientAliasResponse
} from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import AliasInput from './AliasInput'
import { useUpdateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsEditorProps {
	ingredientResponse?: IngredientResponse | null
	resetActiveComponent: (active: ActiveComponentProps) => void
}

const IngredientsEditor = ({
	resetActiveComponent,
	ingredientResponse = null
}: IngredientsEditorProps) => {
	const [ingredient, setIngredient] = useState<IngredientResponse | null>(
		ingredientResponse
	)
	console.log('ingredient', ingredient)

	const [updateIngredient] = useUpdateIngredientMutation()
	// Функция-обёртка для обновления ингредиента
	const memoizedSetIngredient = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredient(prev => {
				const updatedValue = typeof value === 'function' ? value(prev) : value
				return updatedValue
					? { ...structuredClone(prev ?? {}), ...updatedValue }
					: null
			})
		},
		[]
	)

	const addAlias = useCallback(async () => {
		if (!ingredient?.id) return

		const uniqueId = Date.now()
		const newAlias: IngredientAliasResponse = {
			id: uniqueId,
			ingredientId: ingredient.id,
			alias: 'Введи синоним'
		}

		setIngredient(prev =>
			prev ? { ...prev, aliases: [...(prev.aliases || []), newAlias] } : prev
		)
	}, [ingredient])

	const handleDeleteAlias = async (aliasId: number | undefined) => {
		if (!ingredient) return

		try {
			setIngredient(prevIngredient =>
				prevIngredient
					? {
							...prevIngredient,
							aliases: (prevIngredient.aliases || []).filter(
								alias => alias.id !== aliasId
							)
						}
					: prevIngredient
			)
		} catch (error) {
			console.error('Ошибка при удалении alias:', error)
		}
	}

	// const handleSave = async () => {
	// 	if (ingredient && ingredient.id) {
	// 		const updatedIngredient = { id: ingredient?.id, data: { ...ingredient } }
	// 		const responseIngredient =
	// 			await updateIngredient(updatedIngredient).unwrap()
	// 		console.log('responseIngredient', responseIngredient)
	// 		// resetActiveComponent(null)
	// 		setIngredient(responseIngredient)
	// 	}

	// 	// Здесь можно добавить логику сохранения (например, вызов API для обновления ингредиента)
	// }
	const handleSave = async () => {
		if (!ingredient || !ingredient.id) return

		// Создаем новый объект с актуальными alias
		const updatedIngredientData: IngredientResponse = {
			...ingredient,
			aliases: [...(ingredient.aliases ?? [])] // Клонируем aliases
		}

		try {
			const responseIngredient = await updateIngredient({
				id: ingredient.id,
				data: updatedIngredientData
			}).unwrap()

			console.log('responseIngredient', responseIngredient)
			setIngredient(responseIngredient) // Обновляем состояние ингредиента
		} catch (error) {
			console.error('Ошибка при обновлении ингредиента:', error)
		}
	}

	return (
		<div className='flex flex-col relative min-w-full'>
			<Button onClick={handleSave}>Сохранить изменения</Button>
			<span>Введите наименование</span>
			<SimpleAutocompleteInput<IngredientResponse>
				fetchFunction='ingredient'
				className='flex  flex-col w-[70%] items-start relative'
				setItem={memoizedSetIngredient}
				item={ingredientResponse}
			/>
			{ingredient && ingredient.name && (
				<div className='flex flex-col  w-[70%] mt-4'>
					<span>Синонимы</span>
					<Button
						className='ml-2'
						onClick={addAlias}
					>
						Добавить
					</Button>
					{ingredient.aliases?.map((alias: IngredientAliasFormState) => (
						<div
							key={alias.id}
							className='flex flex-col items-center mt-2'
						>
							<div className='flex items-center'>
								<AliasInput
									aliasItem={alias}
									ingredient={ingredient}
									setIngredient={value =>
										memoizedSetIngredient(value as IngredientResponse)
									}
								/>
								<Button
									onClick={() => handleDeleteAlias(alias.id)}
									className='ml-2'
								>
									Удалить
								</Button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default IngredientsEditor
