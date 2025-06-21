/**
 * Типы параметров страниц
 * --------------------------------
 * Определяет типы для параметров URL и страниц в Next.js роутинге
 */

/** Интерфейс для параметра slug в URL */
export interface TypeParamSlug {
	/** Строковый параметр slug из URL */
	slug: string
}

/** Интерфейс для страницы с параметром slug */
export interface PageSlugParam {
	/** Объект параметров, содержащий slug */
	params: TypeParamSlug
}