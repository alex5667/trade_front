'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'

import { useInitialData } from './useInitialData'
import { useUpdateUserMutation } from '@/services/user-redux.services'

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
		<div>
			<form
				className='w-2/4'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='grid grid-cols-2 gap-10'>
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
					<div>
						<Field
							id='workInterval'
							label='WorkInterval'
							placeholder='Enter workInterval:'
							extra='mb-4'
							isNumber
							{...register('workInterval', {
								valueAsNumber: true
							})}
						/>
						<Field
							id='breakInterval'
							label='Break interval(min.)'
							placeholder='Enter break interval (min.):'
							extra='mb-4'
							isNumber
							{...register('breakInterval', {
								valueAsNumber: true
							})}
						/>
						<Field
							id='intervalsCount'
							label='Intervals count(max 10)'
							placeholder='Enter intervals count (max 10):'
							extra='mb-6'
							isNumber
							{...register('intervalsCount', {
								valueAsNumber: true,
								max: 10
							})}
						/>
					</div>
				</div>
				<Button
					type='submit'
					disabled={isLoading}
				>
					Save
				</Button>
			</form>
		</div>
	)
}
