'use client'

import { MenuItem } from './MenuItem'
import { MENU } from './menu.data'

const AdminBoard = () => {
	return (
		<div>
			{MENU.map(item => (
				<MenuItem
					item={item}
					key={item.link}
				/>
			))}
		</div>
	)
}

export default AdminBoard
