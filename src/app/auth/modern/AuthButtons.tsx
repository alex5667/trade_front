import styles from '../../auth/Auth.module.scss'

interface AuthButtonsProps {
	isLoginForm: boolean
	setIsLoginForm: (value: boolean) => void
	onSubmitEmailLogin: () => void
	onSubmitEmailRegister: () => void
	onSubmitPhoneLogin: () => void
	onSubmitPhoneRegister: () => void
	isLoading: boolean
	authMethod: 'email' | 'phone'
}

export const AuthButtons = ({
	isLoginForm,
	setIsLoginForm,
	onSubmitEmailLogin,
	onSubmitEmailRegister,
	onSubmitPhoneLogin,
	onSubmitPhoneRegister,
	isLoading,
	authMethod
}: AuthButtonsProps) => {
	const formId = authMethod === 'email' ? 'email-auth-form' : 'phone-auth-form'
	const handleLoginClick = () => {
		setIsLoginForm(true)
		if (authMethod === 'email') onSubmitEmailLogin()
		else onSubmitPhoneLogin()
	}
	const handleRegisterClick = () => {
		setIsLoginForm(false)
		if (authMethod === 'email') onSubmitEmailRegister()
		else onSubmitPhoneRegister()
	}
	return (
		<div className={styles.authButtons}>
			<button
				type='submit'
				form={formId}
				className={`${styles.loginButton} ${isLoginForm ? 'opacity-100' : 'opacity-50'}`}
				onClick={handleLoginClick}
				disabled={isLoading}
			>
				{isLoading ? 'Signing in...' : 'Login'}
			</button>
			<button
				type='submit'
				form={formId}
				className={`${styles.registerButton} ${!isLoginForm ? 'opacity-100' : 'opacity-50'}`}
				onClick={handleRegisterClick}
				disabled={isLoading}
			>
				{isLoading ? 'Signing up...' : 'Register'}
			</button>
		</div>
	)
}
