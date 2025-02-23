import { DishFormState } from '@/types/dish.type'

import DishCard from './DishCard'

const DishCreator = () => {
	const sampleDish: DishFormState = {
		name: 'Введите наименование блюда',
		printName: 'Введите наименование блюда для печати',
		description: 'Введите описание блюда',

	}
	return (
		<>
			<DishCard dish={sampleDish} />
		</>
	)
}

export default DishCreator
