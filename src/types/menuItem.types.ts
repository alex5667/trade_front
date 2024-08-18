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
	BREAKFAST: 'Сніданок',
	LUNCH: 'Обід',
	SNACK: 'Полуденок',
	DINNER: 'Вечеря'
}

export type MealType = keyof typeof MealTypes

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
	KINDERGARTEN: 'Детский сад',
	SCHOOL: 'Школа'
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