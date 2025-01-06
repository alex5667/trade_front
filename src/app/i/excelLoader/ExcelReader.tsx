'use client'

import { useCallback, useState } from 'react'
import * as XLSX from 'xlsx'

import { Button } from '@/components/ui/buttons/Button'
import WeekChangeButtons from '@/components/weekChangeButtons/WeekChangeButtons'

import { DayOfWeekUkr } from '@/types/menuItem.type'

import { getDatesOfWeek } from '@/utils/getDatesOfWeek'

import { useDownloadFromExcelDishMutation } from '@/services/dish.service'
import { downloadMenuFromExcelService } from '@/services/downloadMenuFromExcelService'
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
	const [sheetNames, setSheetNames] = useState<string[]>([])
	const [selectedSheet, setSelectedSheet] = useState<string>('')
	const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
	const [downloadMenu] = useDownloadFromExcelMenuItemMutation()
	// const [downloadDish] = useDownloadFromExcelDishMutation()

	const [downloadDish, { isLoading }] = useDownloadFromExcelDishMutation({
		fixedCacheKey: 'excelDishRequest'
	})

	const { startOfWeek, endOfWeek, datesOfWeek } = getDatesOfWeek(weekOffset)

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
					setWorkbook(workbook)
					const sheetNames = workbook.SheetNames
					setSheetNames(sheetNames)
					setSelectedSheet(sheetNames[0])
					loadSheetData(workbook, sheetNames[0])
				}
			}

			reader.readAsArrayBuffer(file)
		}
	}

	const loadSheetData = (workbook: XLSX.WorkBook, sheetName: string) => {
		const sheet = workbook.Sheets[sheetName]
		const jsonData = XLSX.utils.sheet_to_json(sheet, {
			header: 1,
			defval: ''
		})
		let emptyRowCount = 0
		const processedData = []

		for (const row of jsonData) {
			const cleanedRow = (row as any[]).map(cell => String(cell).trim())
			const isEmptyRow = (cleanedRow as string[]).every(cell => cell === '')
			if (isEmptyRow) {
				emptyRowCount++
			} else {
				emptyRowCount = 0
			}

			if (emptyRowCount > 15) {
				break
			}

			processedData.push(cleanedRow as string[])
		}
		setData(processedData)
	}

	const handleSheetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const sheetName = event.target.value
		setSelectedSheet(sheetName)
		if (workbook) {
			loadSheetData(workbook, sheetName)
		}
	}

	const downloadMenuFromExcel = () => {
		downloadMenuFromExcelService(data, datesOfWeek, selectedSheet, downloadMenu)
	}

	const downloadDishFromExcel = useCallback(async () => {
		console.log('Отправка запроса')
		await downloadDish({ data, selectedSheet })
		console.log('Запрос завершен')
	}, [data, selectedSheet, downloadDish])

	return (
		<div className='p-6'>
			<h1 className='text-lg font-bold mb-4'>Считывание файла Excel</h1>
			<WeekChangeButtons setWeekOffset={setWeekOffset} />
			<div className='py-3'>
				{startOfWeek.split('T')[0]} - {endOfWeek.split('T')[0]}
			</div>

			{sheetNames.length > 0 && (
				<select
					value={selectedSheet}
					onChange={handleSheetChange}
					className='mb-4 mr-4 px-3 py-2  border rounded'
				>
					{sheetNames.map(sheetName => (
						<option
							key={sheetName}
							value={sheetName}
						>
							{sheetName}
						</option>
					))}
				</select>
			)}

			<Button
				className='py-2 px-4 mr-4'
				onClick={() => downloadMenuFromExcel()}
			>
				Загрузить меню
			</Button>
			<Button
				className='py-2 px-4 mr-4'
				onClick={downloadDishFromExcel}
			>
				Загрузить блюдо
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
									(meals && meals.includes(item.toString().toLowerCase())) ||
									daysOfWeeks.includes(item.toString().toLowerCase())
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
