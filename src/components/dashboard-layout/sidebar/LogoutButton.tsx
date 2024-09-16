'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { ADMINBOARD_PAGES } from '@/config/pages-url.config'

import styles from './Sidebar.module.scss'
import { useLogoutMutation } from '@/services/auth.services'

export function LogoutButton() {
	const { replace } = useRouter()
	const [logout, { isSuccess }] = useLogoutMutation()

	const handleLogout = async () => {
		try {
			await logout()
			replace(ADMINBOARD_PAGES.CUSTOMER)
		} catch (error) {
			console.error('Logout failed:', error)
		}
	}

	return (
		<div className={styles.logoutContainer}>
			<button
				className={styles.logoutButton}
				onClick={() => handleLogout()}
			>
				<LogOut size={20} />
			</button>
		</div>
	)
}
