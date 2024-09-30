import { useEffect, useState, useTransition } from 'react'

import { TaskResponse } from '@/types/task.types'

import { useGetTasksQuery } from '@/services/task.services'

export function useTasks() {
	const { data } = useGetTasksQuery()
	const [items, setItems] = useState<TaskResponse[] | undefined>(data)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		startTransition(() => setItems(data))

	}, [data])
	return { items, setItems, isPending }
}
