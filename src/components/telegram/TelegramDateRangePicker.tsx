import { useState } from 'react'

interface TelegramDateRangePickerProps {
	initialStart: string
	initialEnd: string
	onApply: (startDate: string, endDate: string) => void
}

export const TelegramDateRangePicker = ({
	initialStart,
	initialEnd,
	onApply
}: TelegramDateRangePickerProps) => {
	const [startDate, setStartDate] = useState(initialStart)
	const [endDate, setEndDate] = useState(initialEnd)

	const handleApply = () => {
		if (!startDate || !endDate) return
		onApply(startDate, endDate)
	}

	return (
		<div className='flex flex-col md:flex-row gap-2 items-start md:items-end mb-3'>
			<div className='flex flex-col'>
				<label className='text-xs text-gray-500 mb-1'>Start date</label>
				<input
					type='date'
					className='border rounded px-2 py-1 text-sm'
					value={startDate}
					onChange={e => setStartDate(e.target.value)}
				/>
			</div>
			<div className='flex flex-col'>
				<label className='text-xs text-gray-500 mb-1'>End date</label>
				<input
					type='date'
					className='border rounded px-2 py-1 text-sm'
					value={endDate}
					onChange={e => setEndDate(e.target.value)}
				/>
			</div>
			<button
				onClick={handleApply}
				className='px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700'
			>
				Apply
			</button>
		</div>
	)
}
