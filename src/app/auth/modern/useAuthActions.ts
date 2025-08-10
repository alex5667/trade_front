import { ADMINBOARD_PAGES, ADMINBOARD_PAGES_KEYS } from '@/config/pages-url.config'
import { useAuth } from '@/hooks/useAuth'
import { useLoginByPhoneMutation, useLoginMutation, useRegisterByPhoneMutation, useRegisterMutation } from '@/services/auth.services'
import { AuthForm, PhoneAuthForm } from '@/types/auth.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const useAuthActions = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isGoogleLoading, setIsGoogleLoading] = useState(false)
	const router = useRouter()
	const { user } = useAuth()
	const [login] = useLoginMutation()
	const [register] = useRegisterMutation()
	const [loginByPhone] = useLoginByPhoneMutation()
	const [registerByPhone] = useRegisterByPhoneMutation()

	const onSubmitEmail = async (data: AuthForm, isLoginForm: boolean) => {
		setIsLoading(true)
		try {
			const response = await (isLoginForm ? login : register)(data).unwrap()
			if (response?.user) {
				toast.success(`Successfully ${isLoginForm ? 'logged in' : 'registered'}`)
				const updatedUser = user || response?.user
				if (!isLoginForm) {
					router.push('/')
				} else {
					if (updatedUser?.roles?.length > 0) {
						const upperCaseRole = updatedUser.roles[0].toUpperCase()
						const redirectPath = ADMINBOARD_PAGES[upperCaseRole as ADMINBOARD_PAGES_KEYS] || '/'
						router.push(redirectPath)
					} else {
						router.push('/')
					}
				}
			} else {
				throw new Error('Invalid response from server')
			}
		} catch (error: any) {
			console.error(`${isLoginForm ? 'Login' : 'Register'} error:`, error)
			let errorMessage = `${isLoginForm ? 'Login' : 'Register'} failed`
			if (error?.data?.error) {
				try {
					const parsedError = JSON.parse(error.data.error)
					errorMessage = parsedError?.message || errorMessage
				} catch (e) {
					errorMessage = error.data.error || errorMessage
				}
			} else if (error?.message) {
				errorMessage = error.message
			}
			toast.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const onSubmitPhone = async (data: PhoneAuthForm, isLoginForm: boolean) => {
		setIsLoading(true)
		try {
			const normalizedData = { ...data, phone: data.phone }
			const response = await (isLoginForm ? loginByPhone : registerByPhone)(normalizedData).unwrap()
			if (response?.user) {
				toast.success(`Successfully ${isLoginForm ? 'logged in' : 'registered'}`)
				const updatedUser = user || response?.user
				if (!isLoginForm) {
					router.push('/')
				} else {
					if (updatedUser?.roles?.length > 0) {
						const upperCaseRole = updatedUser.roles[0].toUpperCase()
						const redirectPath = ADMINBOARD_PAGES[upperCaseRole as ADMINBOARD_PAGES_KEYS] || '/'
						router.push(redirectPath)
					} else {
						router.push('/')
					}
				}
			} else {
				throw new Error('Invalid response from server')
			}
		} catch (error: any) {
			console.error(`Phone ${isLoginForm ? 'login' : 'register'} error:`, error)
			let errorMessage = `Phone ${isLoginForm ? 'login' : 'register'} failed`
			if (error?.data?.error) {
				try {
					const parsedError = JSON.parse(error.data.error)
					errorMessage = parsedError?.message || errorMessage
				} catch (e) {
					errorMessage = error.data.error || errorMessage
				}
			} else if (error?.message) {
				errorMessage = error.message
			}
			toast.error(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleLogin = async () => {
		setIsGoogleLoading(true)
		try {
			if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
				throw new Error('API base URL is not configured')
			}
			const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`
			window.location.href = googleAuthUrl
		} catch (error) {
			console.error('Google login error:', error)
			toast.error('Google login failed')
			setIsGoogleLoading(false)
		}
	}

	return { isLoading, isGoogleLoading, onSubmitEmail, onSubmitPhone, handleGoogleLogin }
} 