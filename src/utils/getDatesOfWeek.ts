import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getDatesOfWeek = (weekOffset = 0) => {
	const today = dayjs().add(weekOffset, 'week')

	const startOfWeek = today
		.startOf('week')
		.add(1, 'day')
		.utc()
		.startOf('day')
		.toISOString()

	const endOfWeek = today.endOf('week').utc().startOf('day').toISOString()

	const datesOfWeek: { [key: string]: string } = {}

	for (let i = 0; i < 7; i++) {
		const date = today
			.startOf('week')
			.add(1, 'day').add(i, 'day').utc().startOf('day')
		const dayOfWeek = date.format('dddd').toUpperCase()
		datesOfWeek[dayOfWeek] = date.toISOString()
	}


	return {
		startOfWeek, endOfWeek, datesOfWeek
	}

}



// export const getDatesOfWeek = (weekOffset = 0) => {
// 	console.log('weekOffset', weekOffset)
// 	const today = dayjs().add(weekOffset, 'week')
// 	console.log('date', today.date())

// 	// Если сегодня воскресенье (day() === 0), переход на следующую неделю
// 	const adjustedDate = today.day() === 0 ? today.add(1, 'day') : today
// 	console.log('adjustedDate', adjustedDate)

// 	// Начало недели (понедельник)
// 	const startOfWeek = adjustedDate
// 		.startOf('week')
// 		.add(1, 'day') // Переместить на понедельник
// 		.utc()
// 		.startOf('day')
// 		.toISOString()

// 	// Конец недели (воскресенье)
// 	const endOfWeek = adjustedDate
// 		.startOf('week')
// 		.add(7, 'day') // Конец недели
// 		.utc()
// 		.startOf('day')
// 		.toISOString()

// 	// Генерация дат для каждого дня недели
// 	const datesOfWeek: { [key: string]: string } = {}

// 	for (let i = 0; i < 7; i++) {
// 		const date = adjustedDate
// 			.startOf('week')
// 			.add(1, 'day') // Начинаем с понедельника
// 			.add(i, 'day')
// 			.utc()
// 			.startOf('day')
// 		const dayOfWeek = date.format('dddd').toUpperCase()
// 		datesOfWeek[dayOfWeek] = date.toISOString()
// 	}
// 	console.log('datesOfWeek', datesOfWeek)
// 	return {
// 		startOfWeek,
// 		endOfWeek,
// 		datesOfWeek
// 	}
// }
