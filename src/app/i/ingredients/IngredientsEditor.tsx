'use client'

import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { SimpleField } from '@/components/ui/fields/SImpleField'
import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'
import { CreatorEditorStateProps } from '@/components/сreator-editor/CreatorEditor'

import { IngredientAliasResponse } from '@/types/ingredient-alias.type'
import { IngredientResponse } from '@/types/ingredient.type'

import { errorCatch } from '@/api/error'

import { useUpdateIngredientMutation } from '@/services/ingredient.service'

interface IngredientsEditorProps {
	initialIngredient?: IngredientResponse
	setActiveComponent?: (
		value: SetStateAction<CreatorEditorStateProps | null>
	) => void
}

const IngredientsEditor = ({
	initialIngredient,
	setActiveComponent
}: IngredientsEditorProps) => {
	// Состояние ингредиента, в котором будут храниться и синонимы
	const [ingredient, setIngredient] = useState<IngredientResponse | null>(
		initialIngredient ? initialIngredient : null
	)
	console.log('ingredient', ingredient)

	useEffect(() => {
		if (initialIngredient && initialIngredient.id) {
			setIngredient(initialIngredient)
		}
	}, [initialIngredient])

	const [update, { isSuccess }] = useUpdateIngredientMutation()

	const memoizedSetIngredient = useCallback(
		(value: SetStateAction<IngredientResponse | null>) => {
			setIngredient(value)
		},
		[]
	)

	// Функция добавления нового синонима
	const addAlias = () => {
		if (!ingredient?.id) return

		const newAlias: IngredientAliasResponse = {
			id: Date.now(),
			ingredientId: ingredient.id,
			alias: 'Введи синоним'
		}

		setIngredient(prev => {
			if (!prev) return prev
			// Если синонимы уже существуют – добавляем новый, иначе создаём новый массив
			const updatedAliases = prev.aliases
				? [...prev.aliases, newAlias]
				: [newAlias]
			return { ...prev, aliases: updatedAliases }
		})
	}

	// Функция удаления синонима по id
	const deleteAlias = (id: string | number) => {
		setIngredient(prev => {
			if (!prev) return prev
			const updatedAliases =
				prev.aliases?.filter(alias => alias.id !== id) || []
			return { ...prev, aliases: updatedAliases }
		})
	}

	// Функция изменения значения синонима
	const handleChange =
		(id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			setIngredient(prev => {
				if (!prev || !prev.aliases) return prev
				const updatedAliases = prev.aliases.map(alias =>
					alias.id === id ? { ...alias, alias: value } : alias
				)
				return { ...prev, aliases: updatedAliases }
			})
		}

	// Функция сохранения ингредиента с обновлёнными синонимами
	const handleSave = async () => {
		if (!ingredient || !ingredient.id) {
			toast.error('Ошибка: ингредиент отсутствует или не имеет ID')
			return
		}

		try {
			const responseIngredient = await update({
				id: ingredient.id,
				data: ingredient
			}).unwrap()

			// Проверяем успешность обновления
			if (responseIngredient) {
				setIngredient(responseIngredient)
				toast.success('Ингредиент успешно обновлён!')
			} else {
				toast.error('Ошибка при обновлении ингредиента')
			}
		} catch (error) {
			toast.error(errorCatch(error))
		}

		// Закрываем редактор после сохранения
		setActiveComponent && setActiveComponent(null)
	}

	return (
		<div className='flex flex-col relative w-full'>
			<span>Введите наименование</span>
			<SimpleAutocompleteInput<IngredientResponse>
				fetchFunction='ingredient'
				className='flex w-[70%] flex-col items-start'
				setItem={memoizedSetIngredient}
				item={ingredient?.name ? ingredient : undefined}
			/>
			{ingredient?.aliases && ingredient.name && (
				<div className='flex flex-col w-[70%]'>
					<span>Синонимы</span>
					<Button
						className='ml-2'
						onClick={addAlias}
					>
						Добавить
					</Button>
					{ingredient.aliases.map((alias: IngredientAliasResponse) => (
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
									value={alias.alias}
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
