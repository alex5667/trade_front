import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Админ панель'
}

const AdminBoardPage = () => {
	return (
		<div className='w-[70%] m-auto flex flex-col items-center justify-start'>
			<h1 className='text-2xl font-bold mb-3'>Админ панель</h1>
		</div>
	)
}

export default AdminBoardPage
