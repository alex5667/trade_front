'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { AuthForm } from '@/types/auth.types'

import {
	ADMINBOARD_PAGES,
	ADMINBOARD_PAGES_KEYS
} from '@/config/pages-url.config'

import { useAuth } from '@/hooks/useAuth'

import styles from './Auth.module.scss'
import { useLoginMutation, useRegisterMutation } from '@/services/auth.services'

const Auth = () => {
	const { register, handleSubmit, reset } = useForm<AuthForm>({
		mode: 'onChange'
	})
	const [isLoginForm, setIsLoginForm] = useState(false)
	const { replace } = useRouter()
	const [login] = useLoginMutation()
	const [auth] = useRegisterMutation()
	const { user } = useAuth()

	const onSubmit: SubmitHandler<AuthForm> = async data => {
		try {
			const response = await (isLoginForm ? login : auth)(data)
			toast.success('Successfully logged in')
			reset()
			if (response?.data?.user) {
				const updatedUser = user || response?.data?.user
				const upperCaseRole = updatedUser?.roles.join().toUpperCase()

				replace(ADMINBOARD_PAGES[upperCaseRole as ADMINBOARD_PAGES_KEYS] || '/')
			}
		} catch (error) {
			toast.error(`${isLoginForm ? `Login` : `Register`} failed`)
		}
	}
	return (
		<div className={styles.authContainer}>
			<form
				className={styles.authForm}
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading
					className='text-center text-xl md:text-2xl'
					title='Authorization'
				/>
				<Field
					id='email'
					label='Email'
					placeholder='Enter email:'
					type='email'
					extra='mb-4'
					{...register('email', {
						required: 'Email is required!'
					})}
				/>
				<Field
					id='password'
					label='Password'
					placeholder='Enter password:'
					type='password'
					extra='mb-6'
					{...register('password', {
						required: 'Password is required!'
					})}
				/>
				<div className={styles.authButtons}>
					<Button
						className=' text-white w-full py-2'
						onClick={() => setIsLoginForm(true)}
					>
						Login
					</Button>
					{/* <Button
						className='text-white w-full py-2 px-4  md:w-auto md:py-2 md:px-7  '
						onClick={() => setIsLoginForm(false)}
					>
						Register
					</Button> */}
				</div>
			</form>
		</div>
	)
}

export default Auth
