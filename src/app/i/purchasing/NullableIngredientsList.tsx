// Тип для пропсов компонента
interface NullableIngredientsListProps {
	nullableIngredientsInDishes: string[]
}

// Компонент DishList
const NullableIngredientsList = ({
	nullableIngredientsInDishes
}: NullableIngredientsListProps) => {
	return (
		<div className='p-6'>
			<h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
				Блюда без ингредиентов
			</h1>
			<ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{nullableIngredientsInDishes.map((ingredient, index) => (
					<li
						key={index}
						className='bg-db-bg-button-hover rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300'
					>
						<div className='text-lg font-medium '>{ingredient}</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default NullableIngredientsList
