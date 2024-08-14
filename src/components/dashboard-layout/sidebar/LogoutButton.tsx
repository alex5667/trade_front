'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useLogoutMutation } from '@/services/auth.services'

export function LogoutButton() {
	const router = useRouter()
	const [logout, { isSuccess }] = useLogoutMutation()

	const handleLogout = () => {
		logout()
		if (isSuccess) {
			router.push('/auth')
		}
	}

	return (
		<div className='absolute top-1 right-1'>
			<button
				className='opacity-40 hover:opacity-100 transition-opacity duration-300'
				onClick={() => handleLogout()}
			>
				<LogOut size={20} />
			</button>
		</div>
	)
}
