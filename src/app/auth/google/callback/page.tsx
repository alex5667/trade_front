'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'

export default function GoogleCallback() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Проверяем наличие ошибки в параметрах
		const errorParam = searchParams.get('error')

		if (errorParam) {
			setError('Error during Google authentication')

			// Редирект обратно на страницу логина
			setTimeout(() => {
				router.replace('/auth')
			}, 2000)
			return
		}

		// Если нет ошибки, значит мы должны быть уже перенаправлены на /auth/success
		// бэкендом. Если по какой-то причине мы все еще здесь, перенаправим вручную
		router.replace('/auth/success')
	}, [router, searchParams])

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold mb-4 text-red-500'>{error}</h1>
					<Button
						className='mt-4'
						onClick={() => router.push('/auth')}
					>
						Back to Login
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-center'>
				<h1 className='text-2xl font-bold mb-4'>
					Completing authentication...
				</h1>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
			</div>
		</div>
	)
}
