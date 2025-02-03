import Card from '@/components/ui/card/Card'

import { IngredientFormState } from '@/types/ingredient.type'

const IngredientsCreator = () => {
	const simpleIngredients: IngredientFormState = {
		name: ' Введите наименование',
		printName: ' Введите наименование для печати',
		description: 'Описание',
		unit: 'KG',
		price: 0,
		isAllergen: false,
		aliases: []
	}
	return (
		<Card
			item={simpleIngredients}
			fetchFunction='ingredient'
		/>
	)
}

export default IngredientsCreator
