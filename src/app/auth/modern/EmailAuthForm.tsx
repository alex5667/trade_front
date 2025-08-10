import styles from '../Auth.module.scss'

interface EmailAuthFormProps {
	register: any
	errors: any
	onSubmit: (e?: React.BaseSyntheticEvent) => void
}

export const EmailAuthForm = ({
	register,
	errors,
	onSubmit
}: EmailAuthFormProps) => {
	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// @ts-ignore react-hook-form accepts BaseSyntheticEvent | undefined
		onSubmit(e)
	}
	return (
		<form
			id='email-auth-form'
			method='post'
			onSubmit={handleFormSubmit}
			noValidate
			className={styles.authForm}
		>
			<div className={styles.authField}>
				<label
					htmlFor='email'
					className={styles.label}
				>
					Email
				</label>
				<input
					id='email'
					type='email'
					placeholder='Enter your email'
					className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
					{...register('email', { required: 'Email is required!' })}
				/>
			</div>
			<div className={styles.authField}>
				<label
					htmlFor='password'
					className={styles.label}
				>
					Password
				</label>
				<input
					id='password'
					type='password'
					placeholder='Enter your password'
					className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
					{...register('password', { required: 'Password is required!' })}
				/>
			</div>
		</form>
	)
}
