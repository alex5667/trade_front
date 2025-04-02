import { useEffect } from 'react'
import { UseFormReset } from 'react-hook-form'

import { useGetProfileQuery } from '@/services/user.services'
import { TypeUserForm } from '@/types/auth.types'


export function useInitialData(reset: UseFormReset<TypeUserForm>) {
	const { data, isSuccess } = useGetProfileQuery()
	useEffect(() => {
		if (isSuccess && data) {
			reset({
				email: data?.user.email,
				firstName: data?.user.firstName,

			})
		}
	}, [isSuccess, data, reset])
}
