'use client'

import Loader from '@/components/ui/Loader'

import styles from './Profile.module.scss'
import { useGetProfileQuery } from '@/services/user.services'

export function Profile() {
	const { data, isLoading } = useGetProfileQuery()

	return (
		<div className={styles.profileContainer}>
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles.loaderContainer}>
					<div className={styles.userInfo}>
						<p className={styles.userName}>{data?.user.name}</p>
						<p className={styles.userEmail}>{data?.user.email}</p>
					</div>
					<div className={styles.userAvatar}>
						{data?.user.name?.charAt(0) || 'A'}
					</div>
				</div>
			)}
		</div>
	)
}
