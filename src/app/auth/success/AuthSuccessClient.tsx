'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'

import { useAuth } from '@/hooks/useAuth'

import { getAccessToken, saveTokenStorage } from '@/services/auth-token.service'
import { useGetProfileQuery } from '@/services/user.services'

export default function AuthSuccessClient() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { user } = useAuth()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const accessToken = getAccessToken()
	const { data, isSuccess, isError } = useGetProfileQuery(undefined, {
		skip: !accessToken
	})

	// Функция для перенаправления пользователя
	const redirectUser = () => {
		router.push('/i')
	}

	// Основной эффект загрузки при монтировании компонента
	useEffect(() => {
		const loadUserData = async () => {
			try {
				// Проверяем, есть ли токен в URL параметрах
				const tokenFromUrl = searchParams.get('token')

				// Если токен пришел в URL, сохраняем его
				if (tokenFromUrl) {
					saveTokenStorage(tokenFromUrl)

					// Удаляем токен из URL для безопасности
					const url = new URL(window.location.href)
					url.searchParams.delete('token')
					window.history.replaceState({}, '', url.toString())

					// Получаем новый токен из хранилища после сохранения
					const savedToken = getAccessToken()

					if (savedToken) {
						// Перезагружаем страницу после успешного сохранения токена
						window.location.reload()
						return
					} else {
						// Если токен не сохранился
						console.error('Token not saved properly')
					}
				}

				// Если у нас уже есть пользователь в контексте, используем его
				if (user) {
					toast.success('Successfully logged in')
					redirectUser()
					return
				}

				// Проверяем наличие токена
				const currentToken = getAccessToken()
				if (!currentToken) {
					// Проверяем URL еще раз, возможно token появился после редиректа
					const urlToken = new URLSearchParams(window.location.search).get(
						'token'
					)

					if (urlToken) {
						// Если токен есть в URL, сохраняем его и перезагружаем
						saveTokenStorage(urlToken)

						// Удаляем токен из URL
						const url = new URL(window.location.href)
						url.searchParams.delete('token')
						window.history.replaceState({}, '', url.toString())

						window.location.reload()
						return
					}

					// Если токена нет ни в хранилище, ни в URL, показываем ошибку
					setError('Не удалось найти токен авторизации')
					toast.error('Не удалось завершить вход')

					setTimeout(() => {
						router.replace('/auth')
					}, 2000)
					return
				}

				// Ждем успешного получения данных
				if (isSuccess && data?.user) {
					toast.success('Successfully logged in')
					redirectUser()
				} else if (isError) {
					throw new Error('Failed to fetch user data')
				}
			} catch (error) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router, searchParams, user, isSuccess, isError, data, accessToken])

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
