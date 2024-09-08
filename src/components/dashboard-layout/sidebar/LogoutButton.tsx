'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { URLS } from '@/config/urls'

import styles from './Sidebar.module.scss'
import { useLogoutMutation } from '@/services/auth.services'

export function LogoutButton() {
	const router = useRouter()
	const [logout, { isSuccess }] = useLogoutMutation()

	const handleLogout = () => {
		logout()
		if (isSuccess) {
			router.push(URLS.AUTH)
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
