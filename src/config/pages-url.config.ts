/**
 * Конфигурация URL страниц
 * --------------------------------
 * Централизованное хранение путей для навигации по административной панели
 */

/** Объект с URL всех страниц административной панели */
export const ADMINBOARD_PAGES = {
	/** Главная страница для клиентов */
	CUSTOMER: '/',
	/** Главная страница админ панели */
	ADMIN: '/i',
	/** Страница управления меню */
	MENU: `/i/menu`,
	/** Страница закупок */
	PURCHASING: `/i/purchasing`,
	/** Страница пользователей */
	USER: `/i/user`,
	/** Страница загрузки Excel файлов */
	EXCEL: `/i/excelLoader`,
	/** Страница потребления */
	CONSUMPTION: `/i/consumption`,
	/** Страница блюд */
	DISHES: `/i/dishes`,
	/** Страница редактора базы данных */
	DBEDITOR: `/i/dbEditor`,
	/** Страница ингредиентов */
	INGREDIENTS: `/i/ingredients`,
	/** Страница учреждений */
	INSTITUTIONS: `/i/institutions`,
	/** Страница категорий блюд */
	DISHCATEGORIES: `/i/dishCategories`,
	/** Страница розничных продаж */
	RETAILSALE: `/i/retail-sale`,
	/** Страница перемещения товара */
	STOCKTRANSFER: `/i/stock-transfer`,
	/** Страница приемов пищи */
	MEALS: `/i/meals`,
	/** Страница складов */
	WAREHOUSES: `/i/warehouses`,
	/** Страница настроек */
	SETTINGS: `/i/settings`,
	/** Страница авторизации */
	AUTH: '/auth',
	/** Страница таблицы сигналов */
	SIGNAL_TABLE: '/i/signal-table',
	/** Страница телеграм сигналов */
	TELEGRAM_SIGNALS: '/i/telegram-signals'
}

/** Функция получения базового URL сайта из переменных окружения */
export const getSiteUrl = () => process.env.NEXT_PUBLIC_APP_URL as string

/** Функция формирования URL для админ панели с дополнительным путем */
export const getAdminUrl = (path = '') => `${ADMINBOARD_PAGES.ADMIN}${path}`

/** Тип ключей объекта ADMINBOARD_PAGES */
export type ADMINBOARD_PAGES_KEYS = keyof typeof ADMINBOARD_PAGES