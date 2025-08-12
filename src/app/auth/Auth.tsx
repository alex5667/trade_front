'use client'

import { Heading } from '@/components/ui/Heading'

import type { AuthForm, PhoneAuthForm } from '@/types/auth.types'

import styles from './Auth.module.scss'
// Ported subcomponents
import { AuthButtons } from '@/app/auth/modern/AuthButtons'
import { AuthMethodToggle } from '@/app/auth/modern/AuthMethodToggle'
import { EmailAuthForm } from '@/app/auth/modern/EmailAuthForm'
import { PhoneAuthFormComponent } from '@/app/auth/modern/PhoneAuthForm'
import { useAuthActions } from '@/app/auth/modern/useAuthActions'
import { useAuthForms } from '@/app/auth/modern/useAuthForms'

const Auth = () => {
	const {
		authMethod,
		isLoginForm,
		setIsLoginForm,
		registerEmail,
		handleSubmitEmail,
		errorsEmail,
		registerPhone,
		handleSubmitPhone,
		errorsPhone,
		handleAuthMethodChange
	} = useAuthForms()

	const {
		isLoading,
		isGoogleLoading,
		onSubmitEmail,
		onSubmitPhone,
		handleGoogleLogin
	} = useAuthActions()

	const onEmailFormSubmit = handleSubmitEmail((data: AuthForm) =>
		onSubmitEmail(data, isLoginForm)
	)
	const onPhoneFormSubmit = handleSubmitPhone((data: PhoneAuthForm) =>
		onSubmitPhone(data, isLoginForm)
	)

	// Explicit submit handlers to prevent race between click and form submit
	const onEmailLoginSubmit = handleSubmitEmail((data: AuthForm) =>
		onSubmitEmail(data, true)
	)
	const onEmailRegisterSubmit = handleSubmitEmail((data: AuthForm) =>
		onSubmitEmail(data, false)
	)
	const onPhoneLoginSubmit = handleSubmitPhone((data: PhoneAuthForm) =>
		onSubmitPhone(data, true)
	)
	const onPhoneRegisterSubmit = handleSubmitPhone((data: PhoneAuthForm) =>
		onSubmitPhone(data, false)
	)

	return (
		<div className={styles.authContainer}>
			<div className={styles.authCard}>
				<div className={styles.authHeader}>
					<Heading
						className={styles.authTitle}
						title='Welcome Back'
					/>
					<p className={styles.authSubtitle}>
						Sign in to your account to continue
					</p>
				</div>

				<AuthMethodToggle
					authMethod={authMethod}
					onMethodChange={handleAuthMethodChange}
				/>

				{authMethod === 'email' && (
					<EmailAuthForm
						register={registerEmail}
						errors={errorsEmail}
						onSubmit={onEmailFormSubmit}
					/>
				)}

				{authMethod === 'phone' && (
					<PhoneAuthFormComponent
						register={registerPhone}
						errors={errorsPhone}
						isLoginForm={isLoginForm}
						onSubmit={onPhoneFormSubmit}
					/>
				)}

				<AuthButtons
					isLoginForm={isLoginForm}
					setIsLoginForm={setIsLoginForm}
					onSubmitEmailLogin={onEmailLoginSubmit}
					onSubmitEmailRegister={onEmailRegisterSubmit}
					onSubmitPhoneLogin={onPhoneLoginSubmit}
					onSubmitPhoneRegister={onPhoneRegisterSubmit}
					isLoading={isLoading}
					authMethod={authMethod}
				/>
			</div>
		</div>
	)
}

export default Auth
