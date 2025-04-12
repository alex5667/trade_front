'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

import { URLS } from '@/config/urls'

import Loader from '../ui/Loader'

import { ActiveComponentProps } from './CreatorEditor'
import styles from './EntitiesViewer.module.scss'
import { ComponentMapKeys } from './componentMap'
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
		return <Loader />
	}

	if (error) {
		return (
			<div className={styles.errorContainer}>
				<div className={styles.errorMessage}>{error}</div>
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
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<h2 className={styles.title}>Количество: {entities.length}</h2>
				<Button
					onClick={handleBack}
					className='btn btn-secondary'
				>
					Назад
				</Button>
			</div>

			{entities.length === 0 ? (
				<div className={styles.emptyMessage}>Нет данных</div>
			) : (
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>ID</th>
								<th>Название</th>
								{type === 'dish' && <th>Категория</th>}
								{type === 'ingredient' && <th>Единица измерения</th>}
							</tr>
						</thead>
						<tbody>
							{entities.map(entity => (
								<tr key={entity.id}>
									<td>{entity.id}</td>
									<td className={styles.nameColumn}>{entity.name}</td>
									{type === 'dish' && (
										<td>{entity.dishCategory?.name || '-'}</td>
									)}
									{type === 'ingredient' && <td>{entity.unit || '-'}</td>}
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
