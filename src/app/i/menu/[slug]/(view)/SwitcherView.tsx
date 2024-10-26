'use client'

import cn from 'clsx'
import { Kanban, ListTodo } from 'lucide-react'
import { useTransition } from 'react'

import type { TypeView } from './MenuView'

interface SwitcherView {
	type: TypeView
	setType: (value: TypeView) => void
}

export function SwitcherView({ setType, type }: SwitcherView) {
	const [isPending, startTransition] = useTransition()

	return (
		<div className='flex items-center gap-4 mb-5'>
			<button
				className={cn('flex items-center gap-1', {
					'opacity-40': type === 'kanban',
					'bg-red': isPending
				})}
				onClick={() => {
					startTransition(() => {
						setType('list')
					})
				}}
			>
				<ListTodo className={cn({ 'bg-red': isPending })} />
			</button>
			<button
				className={cn('flex items-center gap-1', {
					'opacity-40': type === 'list'
				})}
				onClick={() => {
					startTransition(() => {
						setType('kanban')
					})
				}}
			>
				<Kanban className={cn({ 'bg-red': isPending })} />
			</button>
		</div>
	)
}
