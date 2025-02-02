import { AutocompleteInput } from '@/components/ui/fields/auto-complete-input/AutocompleteInput'

const DishEditor = () => {
	return (
		<>
			<div className='flex flex-col items-center justify-between w-[90%]'>
				<span> Изменение блюда</span>
				<AutocompleteInput className='flex w-[70%] flex-col items-start' />
			</div>
		</>
	)
}

export default DishEditor
