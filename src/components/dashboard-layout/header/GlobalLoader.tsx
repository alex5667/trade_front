'use client'

import Loader from '@/components/ui/Loader'

import {
	useGetProfileQuery,
	useUpdateUserMutation
} from '@/services/user.services'

export function GlobalLoader() {
	const { isLoading, isFetching } = useGetProfileQuery()
	const [_, { isLoading: isMutating }] = useUpdateUserMutation()

	return isLoading || isMutating || isFetching ? (
		<div className='fixed top-layout right-layout z-50'>
			<Loader />
		</div>
	) : null
}
