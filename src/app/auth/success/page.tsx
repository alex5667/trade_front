'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'

import { User } from '@/types/auth.types'

import { API_BASE_URL } from '@/config/api.config'
import {
	ADMINBOARD_PAGES,
	ADMINBOARD_PAGES_KEYS
} from '@/config/pages-url.config'

import { useAuth } from '@/hooks/useAuth'

import { getAccessToken, saveTokenStorage } from '@/services/auth-token.service'

export default function AuthSuccess() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { user } = useAuth()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Функция для перенаправления пользователя на основе роли
	const redirectUser = (userData: User) => {
		console.log('Redirecting user data:', userData)

		// Проверяем наличие роли админа
		if (userData.roles.includes('admin')) {
			console.log('User has admin role, redirecting to /i')
			router.push('/i')
			return
		}

		// Для других ролей используем конфигурацию
		const upperCaseRole = userData.roles.join().toUpperCase()
		console.log('Role:', upperCaseRole)

		// Прямая проверка на ADMIN для отладки
		if (upperCaseRole === 'ADMIN' || upperCaseRole === 'ADMIN,USER') {
			console.log('User has ADMIN role by uppercase check, redirecting to /i')
			router.push('/i')
		} else {
			console.log('ADMINBOARD_PAGES mapping:', ADMINBOARD_PAGES)
			console.log('Using role key:', upperCaseRole)
			const redirectPath =
				ADMINBOARD_PAGES[upperCaseRole as ADMINBOARD_PAGES_KEYS] || '/'
			console.log('Redirecting user to:', redirectPath)
			router.push(redirectPath)
		}
	}

	// Функция для получения данных пользователя
	const fetchUserData = async (token: string) => {
		try {
			const response = await fetch(`${API_BASE_URL}/user/profile`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				credentials: 'include'
			})

			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.status}`)
			}

			const data = await response.json()
			console.log('User data received:', data)
			return data
		} catch (error) {
			console.error('Error fetching user data:', error)
			throw error
		}
	}

	// Основной эффект загрузки при монтировании компонента
	useEffect(() => {
		const loadUserData = async () => {
			try {
				console.log('AuthSuccess: Starting user data load process')

				// Проверяем, есть ли токен в URL параметрах
				const tokenFromUrl = searchParams.get('token')
				console.log(
					'Token from URL:',
					tokenFromUrl ? 'Present (hidden for security)' : 'Not present'
				)

				let accessToken = getAccessToken()
				console.log(
					'Token from storage:',
					accessToken ? 'Present (hidden for security)' : 'Not present'
				)

				// Если токен пришел в URL, сохраняем его и используем
				if (tokenFromUrl) {
					console.log('Saving token from URL')
					saveTokenStorage(tokenFromUrl)
					accessToken = tokenFromUrl

					// Удаляем токен из URL для безопасности
					const url = new URL(window.location.href)
					url.searchParams.delete('token')
					window.history.replaceState({}, '', url.toString())
				}

				// Если у нас уже есть пользователь в контексте, используем его
				if (user) {
					console.log('User already in context:', user.email)
					toast.success('Successfully logged in')
					redirectUser(user)
					return
				}

				// Если токена нет - ошибка
				if (!accessToken) {
					throw new Error('No access token available')
				}

				// Иначе получаем данные пользователя по токену
				console.log('Fetching user data with token')
				const userData = await fetchUserData(accessToken)

				if (userData && userData.user) {
					console.log('User data fetched successfully:', userData.user.email)
					console.log('User roles:', userData.user.roles)
					toast.success('Successfully logged in')
					redirectUser(userData.user)
				} else if (userData) {
					// Возможно данные пользователя находятся в корне ответа
					console.log('Checking alternate user data structure')
					if (userData.email && userData.roles) {
						console.log('Found user data in response root:', userData.email)
						toast.success('Successfully logged in')
						redirectUser(userData)
					} else {
						console.log('No valid user data in response:', userData)
						throw new Error('No valid user data in API response')
					}
				} else {
					throw new Error('No user data received from API')
				}
			} catch (error) {
				console.error('Auth success error:', error)
				setError(
					'Failed to complete login: ' +
						(error instanceof Error ? error.message : 'Unknown error')
				)
				toast.error('Failed to complete login')
				setTimeout(() => {
					router.replace('/auth')
				}, 2000)
			} finally {
				setLoading(false)
			}
		}

		loadUserData()
	}, [router, searchParams, user])

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
					{user ? 'Login successful! Redirecting...' : 'Processing login...'}
				</h1>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
			</div>
		</div>
	)
}
