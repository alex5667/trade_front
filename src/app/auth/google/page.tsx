'use client'

import { useEffect } from 'react'

import { URLS } from '@/config/urls'

export default function GoogleAuth() {
	useEffect(() => {
		// Открываем URL авторизации напрямую через бэкенд
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
		const authUrl = `${apiBaseUrl}${URLS.AUTH_GOOGLE}`

		// Используем window.location.replace вместо href для лучшего UX
		window.location.replace(authUrl)
	}, [])

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-center'>
				<h1 className='text-2xl font-bold mb-4'>
					Redirecting to Google login...
				</h1>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
			</div>
		</div>
	)
}
