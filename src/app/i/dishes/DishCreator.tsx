import { DishFormState } from '@/types/dish.type'

import DishCard from './DishCard'

const DishCreator = () => {
	const sampleDish: DishFormState = {
		name: 'Введите наименование блюда',
		printName: 'Введите наименование блюда для печати',
		description: 'Введите описание блюда',
		price: 0,

		createdAt: new Date(),
		updatedAt: new Date(),
		ingredients: [],
		dishPhotos: [],
		dishAlias: []
	}
	return (
		<>
			<DishCard dish={{} as DishFormState} />
		</>
	)
}

export default DishCreator
