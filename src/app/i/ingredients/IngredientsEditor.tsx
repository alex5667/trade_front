'use client'

import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { ActiveComponentProps } from '@/components/сreator-editor/CreatorEditor'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
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
	const [updateIngredient, { isLoading: isUpdating }] =
		useUpdateIngredientMutation()

	// Синхронизация с пропсом ingredientResponse
	useEffect(() => {
		setIngredient(ingredientResponse)
	}, [ingredientResponse])

	// Мемоизированная функция для обновления ingredient
	const memoizedSetIngredient = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredient(prev => {
				const updatedValue = typeof value === 'function' ? value(prev) : value
				if (!updatedValue) return null

				// Сохраняем существующие aliases, если они не перезаписаны
				return {
					...prev,
					...updatedValue,
					aliases: updatedValue.aliases ?? prev?.aliases ?? []
				}
			})
		},
		[]
	)

	// Добавление нового алиаса
	const addAlias = useCallback(() => {
		if (!ingredient?.id) {
			toast.error('Выберите ингредиент перед добавлением синонима')
			return
		}

		const uniqueId = Date.now() // Временный ID для локального использования
		const newAlias: IngredientAliasResponse = {
			id: uniqueId,
			ingredientId: ingredient.id,
			alias: 'Введи синоним'
		}

		setIngredient(prev =>
			prev ? { ...prev, aliases: [...(prev.aliases || []), newAlias] } : prev
		)
	}, [ingredient])

	// Удаление алиаса
	const handleDeleteAlias = useCallback(
		(aliasId: number | undefined) => {
			if (!ingredient || aliasId === undefined) return

			setIngredient(prev =>
				prev
					? {
							...prev,
							aliases: (prev.aliases || []).filter(
								alias => alias.id !== aliasId
							)
						}
					: prev
			)
		},
		[ingredient]
	)

	// Сохранение изменений
	const handleSave = async () => {
		if (!ingredient || !ingredient.id) {
			toast.error('Выберите ингредиент для сохранения')
			return
		}

		try {
			const updatedIngredientData: IngredientResponse = {
				...ingredient,
				aliases: [...(ingredient.aliases ?? [])] // Клонируем aliases
			}

			const responseIngredient = await updateIngredient({
				id: ingredient.id,
				data: updatedIngredientData
			}).unwrap()

			setIngredient(responseIngredient)
			// resetActiveComponent(null)
			toast.success('Ингредиент успешно обновлен')
		} catch (error) {
			console.error('Ошибка при обновлении ингредиента:', error)
			toast.error('Ошибка при обновлении ингредиента')
		}
	}

	return (
		<div className='flex flex-col relative min-w-full'>
			<Button
				onClick={handleSave}
				disabled={isUpdating}
			>
				{isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
			</Button>
			<span>Введите наименование</span>
			<SimpleAutocompleteInput<IngredientResponse>
				fetchFunction='ingredient'
				className='flex flex-col w-[70%] items-start relative'
				setItem={memoizedSetIngredient}
				item={ingredient} // Используем текущее состояние ingredient
			/>
			{ingredient && ingredient.name && (
				<div className='flex flex-col w-[70%] mt-4'>
					<span>Синонимы</span>
					<Button
						className='ml-2'
						onClick={addAlias}
						disabled={isUpdating}
					>
						Добавить
					</Button>
					{ingredient.aliases?.map((alias: IngredientAliasResponse) => (
						<div
							key={alias.id}
							className='flex flex-col items-center mt-2'
						>
							<div className='flex items-center'>
								<AliasInput
									aliasItem={alias}
									ingredient={ingredient}
									setIngredient={memoizedSetIngredient}
								/>
								<Button
									onClick={() => handleDeleteAlias(alias.id)}
									className='ml-2'
									disabled={isUpdating}
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
