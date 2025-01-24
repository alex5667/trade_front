import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { DishCategoryResponse } from '@/types/dishCategory.type'

const DishCategory = () => {
	return (
		<div className='flex flex-col relative'>
			<span> Введите наименование </span>
			<SimpleAutocompleteInput<DishCategoryResponse>
				fetchFunction={'dishCategory'}
				className='flex w-[70%] flex-col items-start'
			/>
		</div>
	)
}

export default DishCategory
