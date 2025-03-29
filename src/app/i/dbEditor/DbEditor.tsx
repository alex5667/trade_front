import MenuItem from '@/components/menu-item/MenuItem'

import { DBEDITORMENU } from './dbEditor-data'

const DbEditor = () => {
	return (
		<div className='w-[70%] m-auto flex flex-col items-center justify-start'>
			{DBEDITORMENU.map(item => (
				<MenuItem
					key={item.name}
					item={item}
				/>
			))}
		</div>
	)
}

export default DbEditor
