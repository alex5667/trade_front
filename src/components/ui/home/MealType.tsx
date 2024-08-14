import { MenuItemResponse } from '@/types/menuItem.types'

import { Heading } from '../Heading'

const MealType = ({
	items,
	meal
}: {
	items: MenuItemResponse[]
	meal: string
}) => {
	return (
		<div>
			<Heading
				title={meal}
				size='xs'
			/>
			{items && items.length > 0 ? (
				<ul>
					{items.map((item, idx) => (
						<li
							className='text-xs bg-text-secondary'
							key={item.id}
						>
							{idx} {item.dish.name}
						</li>
					))}
				</ul>
			) : (
				<p>No menu items available</p>
			)}
		</div>
	)
}

export default MealType
