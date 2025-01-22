import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { MealResponse } from '@/types/meal.type'

const Meals = () => {
	return (
		<div className='flex flex-col relative'>
			<span> Введите наименование </span>
			<SimpleAutocompleteInput<MealResponse>
				fetchFunction={'meal'}
				className='flex w-[70%] flex-col items-start'
			/>
		</div>
	)
}

export default Meals
