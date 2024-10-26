'use client'

import Loader from '@/components/ui/Loader'

import {
	useGetProfileQuery,
	useUpdateUserMutation
} from '@/services/user.services'

export function GlobalLoader() {
	const { isLoading } = useGetProfileQuery()
	const [_, { isLoading: isMutating }] = useUpdateUserMutation()

	return isMutating || isLoading ? (
		<div className='fixed top-layout right-layout z-50'>
			<Loader />
		</div>
	) : null
}
