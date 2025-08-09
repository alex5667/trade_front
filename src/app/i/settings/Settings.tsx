'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'

import styles from './Settings.module.scss'
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
		<div className={styles.root}>
			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className={styles.column}>
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
							{...register('firstName')}
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
					className={styles.submit}
				>
					Save
				</Button>
			</form>
		</div>
	)
}
