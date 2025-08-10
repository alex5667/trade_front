import { AuthMethod } from '@/types/auth.types'

import styles from '../../auth/Auth.module.scss'

interface AuthMethodToggleProps {
	authMethod: AuthMethod
	onMethodChange: (method: AuthMethod) => void
}

export const AuthMethodToggle = ({
	authMethod,
	onMethodChange
}: AuthMethodToggleProps) => {
	return (
		<div className={styles.authMethodToggle}>
			<button
				type='button'
				className={`${styles.authMethodButton} ${authMethod === 'email' ? styles.authMethodButtonActive : styles.authMethodButtonInactive}`}
				onClick={() => onMethodChange('email')}
			>
				Email
			</button>
			<button
				type='button'
				className={`${styles.authMethodButton} ${authMethod === 'phone' ? styles.authMethodButtonActive : styles.authMethodButtonInactive}`}
				onClick={() => onMethodChange('phone')}
			>
				Phone
			</button>
		</div>
	)
}
