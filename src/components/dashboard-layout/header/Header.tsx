import { GlobalLoader } from './GlobalLoader'
import styles from './Header.module.scss'
import { Profile } from './profile/Profile'

export function Header() {
	return (
		<header className={styles.header}>
			<GlobalLoader />
			<Profile />
		</header>
	)
}
