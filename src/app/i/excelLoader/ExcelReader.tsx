'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'

import { Button } from '@/components/ui/buttons/Button'
import WeekChangeButtons from '@/components/weekChangeButtons/WeekChangeButtons'

import { DayOfWeekUkr, ExcelDto } from '@/types/menuItem.type'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import { useGetAllMealsQuery } from '@/services/meal.service'
import { useDownloadFromExcelMenuItemMutation } from '@/services/menu-item.service'

export default function ExcelReader() {
	const [data, setData] = useState<string[][]>([])
	const { data: mealsResponse } = useGetAllMealsQuery()
	const meals =
		mealsResponse && mealsResponse.map(meal => meal.printName.toLowerCase())
	const daysOfWeeks = Object.values(DayOfWeekUkr).map(item =>
		item.toLowerCase()
	)
	const [weekOffset, setWeekOffset] = useState(0)
	const [sheetName, setSheetName] = useState('')
	const [downloadMenu] = useDownloadFromExcelMenuItemMutation()

	const { startOfWeek, endOfWeek, datesOfWeek } = getDatesOfWeek(weekOffset)
	// const{refetch}=useGetAllMenuItemQuery({
	// 	startDate:startOfWeek,
	// 	endDate:endOfWeek,
	// })

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()

			reader.onload = e => {
				const arrayBuffer = e.target?.result
				if (arrayBuffer instanceof ArrayBuffer) {
					const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
						type: 'array'
					})
					const sheetName = workbook.SheetNames[0]
					setSheetName(sheetName)
					const sheet = workbook.Sheets[sheetName]
					const jsonData = XLSX.utils.sheet_to_json(sheet, {
						header: 1,
						defval: ''
					})

					let emptyRowCount = 0
					const processedData = []

					for (const row of jsonData) {
						const cleanedRow = (row as string[]).map(cell =>
							typeof cell === 'string' ? cell.trim() : cell
						)
						const isEmptyRow = (cleanedRow as string[]).every(
							cell => cell === ''
						)
						if (isEmptyRow) {
							emptyRowCount++
						} else {
							emptyRowCount = 0
						}

						if (emptyRowCount > 15) {
							break
						}

						processedData.push(row as string[])
					}

					setData(processedData)
				}
			}

			reader.readAsArrayBuffer(file)
		}
	}
	const downloadMenuFromExcel = () => {
		if (data.length > 0) {
			const dto: ExcelDto = {
				data,
				dates: datesOfWeek,
				institutionName: sheetName
			}
			downloadMenu(dto)
		}
		return
	}

	return (
		<div className='p-6'>
			<h1 className='text-lg font-bold mb-4'>Считывание файла Excel</h1>
			<WeekChangeButtons setWeekOffset={setWeekOffset} />
			<div className='py-3'>
				{startOfWeek.split('T')[0]} - {endOfWeek.split('T')[0]}
			</div>
			<Button
				className='py-2 px-4 mr-4'
				onClick={() => downloadMenuFromExcel()}
			>
				Загрузить меню
			</Button>
			<input
				type='file'
				accept='.xlsx, .xls'
				onChange={handleFileUpload}
				className='mb-4'
			/>
			{data.length > 0 && (
				<table className='table-auto border-collapse border border-gray-300'>
					<tbody>
						{data.map((row, rowIndex) => {
							const isHeader = row.some(
								item =>
									(meals && meals.includes(item.toLowerCase())) ||
									daysOfWeeks.includes(item.toLowerCase())
							)
							const Tag = isHeader ? 'th' : 'td'

							return (
								<tr key={rowIndex}>
									{row.map((cell, cellIndex) => (
										<Tag
											key={cellIndex}
											className='border border-gray-300 px-4 py-2'
										>
											{cell}
										</Tag>
									))}
								</tr>
							)
						})}
					</tbody>
				</table>
			)}
		</div>
	)
}
