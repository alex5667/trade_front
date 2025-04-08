'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { URLS } from '@/config/urls'

import { ActiveComponentProps } from './CreatorEditor'
import { ComponentMapKeys, componentMap } from './componentMap'
import { baseQueryWIthReAuth } from '@/services/baseQueries'
import { useGetAllDishesQuery } from '@/services/dish.service'
import { useGetAllIngredientsQuery } from '@/services/ingredient.service'

interface EntitiesViewerProps {
	type: ComponentMapKeys
	resetActiveComponent: (active: ActiveComponentProps) => void
}

const EntitiesViewer = ({
	type,
	resetActiveComponent
}: EntitiesViewerProps) => {
	const [entities, setEntities] = useState<any[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	// Custom hooks for specific entity types
	const { data: dishes, isLoading: isDishesLoading } = useGetAllDishesQuery(
		undefined,
		{ skip: type !== 'dish' }
	)
	const { data: ingredients, isLoading: isIngredientsLoading } =
		useGetAllIngredientsQuery(undefined, { skip: type !== 'ingredient' })

	// Generic fetch for other entity types
	const fetchEntities = async () => {
		if (type === 'dish' || type === 'ingredient') return

		setLoading(true)
		setError(null)

		let url = ''
		switch (type) {
			case 'institution':
				url = URLS.INSTITUTIONS
				break
			case 'meal':
				url = URLS.MEALS
				break
			case 'dishCategory':
				url = URLS.DISHCATEGORIES
				break
			case 'warehouse':
				url = URLS.WAREHOUSES
				break
			default:
				setError('Неизвестный тип сущности')
				setLoading(false)
				return
		}

		try {
			const controller = new AbortController()
			const result = await baseQueryWIthReAuth(
				{
					url,
					method: 'GET'
				},
				{
					signal: controller.signal,
					dispatch: () => {},
					getState: () => {},
					extra: undefined,
					endpoint: '',
					type: 'query',
					abort: () => {}
				},
				{}
			)

			if (result.error) {
				setError('Ошибка при получении данных')
			} else {
				setEntities(result.data as any[])
			}
		} catch (err) {
			setError('Ошибка при получении данных')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (type === 'dish' || type === 'ingredient') return
		fetchEntities()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [type])

	useEffect(() => {
		if (type === 'dish' && dishes) {
			setEntities(dishes)
		}
	}, [dishes, type])

	useEffect(() => {
		if (type === 'ingredient' && ingredients) {
			setEntities(ingredients)
		}
	}, [ingredients, type])

	const handleBack = () => resetActiveComponent(null)

	if (loading || isDishesLoading || isIngredientsLoading) {
		return <div className='text-center p-4'>Загрузка...</div>
	}

	if (error) {
		return (
			<div className='flex flex-col items-center'>
				<div className='text-red-500 mb-4'>{error}</div>
				<Button
					onClick={handleBack}
					className='btn btn-secondary'
				>
					Назад
				</Button>
			</div>
		)
	}

	return (
		<div className='w-full'>
			<div className='mb-4 flex justify-between items-center'>
				<h2 className='text-xl font-bold'>
					{componentMap[type].title}: {entities.length}
				</h2>
				<Button
					onClick={handleBack}
					className='btn btn-secondary'
				>
					Назад
				</Button>
			</div>

			{entities.length === 0 ? (
				<div className='text-center p-4'>Нет данных</div>
			) : (
				<div className='border rounded-lg overflow-hidden'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									ID
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Название
								</th>
								{type === 'dish' && (
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Категория
									</th>
								)}
								{type === 'ingredient' && (
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Единица измерения
									</th>
								)}
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{entities.map(entity => (
								<tr
									key={entity.id}
									className='hover:bg-gray-50'
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{entity.id}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										{entity.name}
									</td>
									{type === 'dish' && (
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{entity.dishCategory?.name || '-'}
										</td>
									)}
									{type === 'ingredient' && (
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{entity.unit || '-'}
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default EntitiesViewer
