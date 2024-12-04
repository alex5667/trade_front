'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'

import { useInitialData } from './useInitialData'
import { useUpdateUserMutation } from '@/services/user.services'

export function Settings() {
	const { register, handleSubmit, reset } = useForm<TypeUserForm>({
		mode: 'onChange'
	})
	useInitialData(reset)
	const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation()

	const onSubmit: SubmitHandler<TypeUserForm> = data => {
		const { password, ...rest } = data
		updateUser({
			...rest,
			password: password || undefined
		})
		if (isSuccess) {
			toast.success('Successfully update profile!')
		}
	}
	return (
		<div className='w-full'>
			<form
				className='w-2/4 m-auto'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-col w-2/3 '>
					<div>
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
							id='name'
							label='Name'
							placeholder='Enter name:'
							{...register('name')}
							extra='mb-4'
						/>
						<Field
							id='password'
							label='Password'
							placeholder='Enter password:'
							type='password'
							extra='mb-10'
							{...register('password')}
						/>
					</div>
				</div>
				<Button
					type='submit'
					disabled={isLoading}
					className='text-text-white py-2 px-8'
				>
					Save
				</Button>
			</form>
		</div>
	)
}
