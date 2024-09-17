import { DishResponse } from './dish.type'



export interface MenuItemResponse {
	id: number
	meal: MealType
	dayOfWeek: DayOfWeek
	date: string
	dish: DishResponse
	createdAt?: string
	updatedAt?: string
	institution: InstitutionType
	description?: String
	price?: number
}

export type MenuItemForm = Omit<MenuItemResponse, 'id' | 'createdAt' | 'updatedAt'>
export const MealTypes = {
	Breakfast: 'Сніданок',
	Lunch: 'Обід',
	Snack: 'Полуденок',
	Dinner: 'Вечеря'
}

export type TypeMeal = keyof typeof MealTypes


export type MealType = {
	id: number,
	name: string,
	printName: string,
	description: string | null,
	createdAt: string,
	updatedAt: string,
	slug: string
}

export const DayOfWeekUkr = {
	MONDAY: 'Понеділок',
	TUESDAY: 'Вівторок',
	WEDNESDAY: 'Середа',
	THURSDAY: 'Четвер',
	FRIDAY: `П'ятниця`,
	SATURDAY: 'Субота',
	SUNDAY: 'Неділя'
}
export type DayOfWeek = keyof typeof DayOfWeekUkr

export const InstitutionType = {
	'slon-1': 'Слон 1',
	'slon-2': 'Слон 2',
	'slon-3': 'Слон 3',
	kosmicheskaya: 'Космічна',
	naberezhnaya: 'Набережна',
}

export type InstitutionType = keyof typeof InstitutionType

export enum EnumMenuSort {
	HIGH_PRICE = 'high-price',
	LOW_PRICE = 'low-price',
	NEWEST = 'newest',
	OLDEST = 'oldest'
}

export type MenuItemDataFilters = {
	sort?: EnumMenuSort | string
	searchTerm?: string
	minPrice?: string
	maxPrice?: string
	startDate?: string
	endDate?: string
}