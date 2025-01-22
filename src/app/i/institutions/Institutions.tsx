import { SimpleAutocompleteInput } from '@/components/ui/simple-auto-complete-input/SimpleAutoCompleteInput'

import { InstitutionResponse } from '@/types/institution.type'

const Institutions = () => {
	return (
		<div className='flex flex-col relative'>
			<span> Введите наименование </span>
			<SimpleAutocompleteInput<InstitutionResponse>
				fetchFunction={'institution'}
				className='flex w-[70%] flex-col items-start'
			/>
		</div>
	)
}

export default Institutions
