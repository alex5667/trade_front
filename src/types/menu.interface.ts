'use strict'

/**
 * Интерфейсы для системы меню
 * --------------------------------
 * Определяет структуру элементов меню навигации
 */

import { LucideIcon } from 'lucide-react'

/** Элемент меню навигации */
export interface MenuItem {
	/** Ссылка для навигации */
	link: string
	/** Отображаемое название пункта меню */
	name: string
	/** Иконка из библиотеки Lucide React */
	icon: LucideIcon
	/** Конечная точка API (необязательно) */
	endPoint?: string | null
}
