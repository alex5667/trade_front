import styles from '../Auth.module.scss'

interface PhoneAuthFormProps {
	register: any
	errors: any
	isLoginForm: boolean
	onSubmit: (e?: React.BaseSyntheticEvent) => void
}

export const PhoneAuthFormComponent = ({
	register,
	errors,
	isLoginForm,
	onSubmit
}: PhoneAuthFormProps) => {
	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// @ts-ignore react-hook-form accepts BaseSyntheticEvent | undefined
		onSubmit(e)
	}
	return (
		<form
			id='phone-auth-form'
			method='post'
			onSubmit={handleFormSubmit}
			noValidate
			className={styles.authForm}
		>
			<div className={styles.authField}>
				<label
					htmlFor='phone'
					className={styles.label}
				>
					Phone
				</label>
				<input
					id='phone'
					type='tel'
					placeholder='+1 (555) 000-0000'
					className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
					{...register('phone', { required: 'Phone is required!' })}
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
			{!isLoginForm && (
				<>
					<div className={styles.authField}>
						<label
							htmlFor='firstName'
							className={styles.label}
						>
							First name (optional)
						</label>
						<input
							id='firstName'
							type='text'
							placeholder='Your first name'
							className={styles.input}
							{...register('firstName')}
						/>
					</div>
					<div className={styles.authField}>
						<label
							htmlFor='lastName'
							className={styles.label}
						>
							Last name (optional)
						</label>
						<input
							id='lastName'
							type='text'
							placeholder='Your last name'
							className={styles.input}
							{...register('lastName')}
						/>
					</div>
				</>
			)}
		</form>
	)
}
