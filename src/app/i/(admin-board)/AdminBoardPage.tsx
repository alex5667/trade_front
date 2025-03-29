import { Metadata } from 'next'

import MenuItem from '@/components/menu-item/MenuItem'

import { ADMINMENU } from './admin-menu'

export const metadata: Metadata = {
	title: 'Админ панель'
}

const AdminBoardPage = () => {
	return (
		<div className='w-[70%] m-auto flex flex-col items-center justify-start'>
			<h1 className='text-2xl font-bold mb-3'>Админ панель</h1>
			{ADMINMENU.map(item => (
				<MenuItem
					key={item.name}
					item={item}
				/>
			))}
		</div>
	)
}

export default AdminBoardPage
