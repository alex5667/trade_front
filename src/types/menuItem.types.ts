import { DishResponse } from './dish.type'



export interface MenuItemResponse {
	id: number
	mealType: MealType
	dayOfWeek: DayOfWeek
	date: string
	dish: DishResponse
	createdAt?: string
	updatedAt?: string
	institutionType: InstitutionType
	description?: String
	price?: number
}

export type MenuItemForm = Omit<MenuItemResponse, 'id' | 'createdAt' | 'updatedAt'>
export const MealTypes = {
	BREAKFAST: 'Завтрак',
	LUNCH: 'Обед',
	SNACK: 'Полдник',
	DINNER: 'Ужин'
}

export type MealType = keyof typeof MealTypes

export const DayOfWeek = {
	MONDAY: 'Понедельник',
	TUESDAY: 'Вторник',
	WEDNESDAY: 'Среда',
	THURSDAY: 'Четверг',
	FRIDAY: 'Пятница',
	SATURDAY: 'Суббота',
	SUNDAY: 'Воскресенье'
}
export type DayOfWeek = keyof typeof DayOfWeek

export const InstitutionType = {
	KINDERGARTEN: 'Детский сад',
	SCHOOL: 'Школа'
}

export type InstitutionType = keyof typeof InstitutionType
