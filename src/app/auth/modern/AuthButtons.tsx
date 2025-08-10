import styles from '../../auth/Auth.module.scss'

interface AuthButtonsProps {
	isLoginForm: boolean
	setIsLoginForm: (value: boolean) => void
	onSubmitEmail: () => void
	onSubmitPhone: () => void
	isLoading: boolean
	authMethod: 'email' | 'phone'
}

export const AuthButtons = ({
	isLoginForm,
	setIsLoginForm,
	onSubmitEmail,
	onSubmitPhone,
	isLoading,
	authMethod
}: AuthButtonsProps) => {
	const formId = authMethod === 'email' ? 'email-auth-form' : 'phone-auth-form'
	return (
		<div className={styles.authButtons}>
			<button
				type='submit'
				form={formId}
				className={`${styles.loginButton} ${isLoginForm ? 'opacity-100' : 'opacity-50'}`}
				onClick={() => setIsLoginForm(true)}
				disabled={isLoading}
			>
				{isLoading ? 'Signing in...' : 'Login'}
			</button>
			<button
				type='submit'
				form={formId}
				className={`${styles.registerButton} ${!isLoginForm ? 'opacity-100' : 'opacity-50'}`}
				onClick={() => setIsLoginForm(false)}
				disabled={isLoading}
			>
				{isLoading ? 'Signing up...' : 'Register'}
			</button>
		</div>
	)
}
