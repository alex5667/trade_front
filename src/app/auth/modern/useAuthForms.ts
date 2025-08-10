import { AuthForm, AuthMethod, PhoneAuthForm } from '@/types/auth.types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useAuthForms = () => {
	const [authMethod, setAuthMethod] = useState<AuthMethod>('email')
	const [isLoginForm, setIsLoginForm] = useState(true)

	const { register: registerEmail, handleSubmit: handleSubmitEmail, reset: resetEmail, formState: { errors: errorsEmail } } = useForm<AuthForm>({ mode: 'onChange' })
	const { register: registerPhone, handleSubmit: handleSubmitPhone, reset: resetPhone, formState: { errors: errorsPhone } } = useForm<PhoneAuthForm>({ mode: 'onChange' })

	const handleAuthMethodChange = (method: AuthMethod) => {
		setAuthMethod(method)
		resetEmail(); resetPhone()
	}

	return { authMethod, isLoginForm, setIsLoginForm, registerEmail, handleSubmitEmail, resetEmail, errorsEmail, registerPhone, handleSubmitPhone, resetPhone, errorsPhone, handleAuthMethodChange }
} 