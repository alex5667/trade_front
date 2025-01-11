import { AutocompleteInput } from '@/components/ui/fields/auto-complete-input/AutocompleteInput'

const Dishes = () => {
	return (
		<div className='flex flex-col relative'>
			<span> Введите наименование блюда</span>
			<AutocompleteInput className='flex w-[70%] flex-col items-start' />
		</div>
	)
}

export default Dishes
