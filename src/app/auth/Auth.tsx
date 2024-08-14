'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { AuthForm } from '@/types/auth.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { useLoginMutation, useRegisterMutation } from '@/services/auth.services'

const Auth = () => {
	const { register, handleSubmit, reset } = useForm<AuthForm>({
		mode: 'onChange'
	})
	const [isLoginForm, setIsLoginForm] = useState(false)
	const { push } = useRouter()
	const [login] = useLoginMutation()
	const [auth] = useRegisterMutation()

	const onSubmit: SubmitHandler<AuthForm> = async data => {
		try {
			await (isLoginForm ? login : auth)(data)
			toast.success('Successfully logged in')
			reset()
			push(DASHBOARD_PAGES.HOME)
		} catch (error) {
			toast.error(`${isLoginForm ? `Login` : `Register`} failed`)
		}
	}
	return (
		<div className='flex min-h-screen'>
			<form
				className='w-1/4 m-auto shadow bg-secondary rounded-xl p-layout'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading title='Auth' />
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
				<div className='flex items-center gap-5 justify-center'>
					<Button onClick={() => setIsLoginForm(true)}>Login</Button>
					<Button onClick={() => setIsLoginForm(false)}>Register</Button>
				</div>
			</form>
		</div>
	)
}

export default Auth
