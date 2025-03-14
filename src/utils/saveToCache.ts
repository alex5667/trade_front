'use strict'

import { getNextSaturday } from './getNextSaturday'

export const saveToCache = (key: string, data: any) => {
	const expiresAt = getNextSaturday() // Дата ближайшей субботы
	const cacheData = {
		expiresAt,
		data
	}
	localStorage.setItem(key, JSON.stringify(cacheData))
}

export const loadFromCache = (key: string) => {
	const cached = localStorage.getItem(key)
	if (!cached) return null

	try {
		const { expiresAt, data } = JSON.parse(cached)

		// Если срок хранения истёк, удаляем кэш
		if (Date.now() > expiresAt) {
			localStorage.removeItem(key)
			return null
		}

		return data // Если кэш актуален, возвращаем данные
	} catch (error) {
		console.error('Ошибка при разборе кэша:', error)
		localStorage.removeItem(key)
		return null
	}
}
