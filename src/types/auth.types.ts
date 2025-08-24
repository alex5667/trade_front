/**
 * Типы для системы авторизации
 * --------------------------------
 * Определяет интерфейсы и типы для работы с аутентификацией и авторизацией пользователей
 */

/** Форма авторизации с email и паролем */
export interface AuthForm {
	/** Электронная почта пользователя */
	email: string
	/** Пароль пользователя */
	password: string
}

/** Форма авторизации по телефону */
export interface PhoneAuthForm {
	phone: string
	password: string
	firstName?: string
	lastName?: string
}

/** Модель пользователя в системе */
export interface User {
	/** Уникальный идентификатор пользователя */
	id: string
	/** Электронная почта пользователя */
	email: string
	/** Имя пользователя (необязательно) */
	firstName?: string
	/** Фамилия пользователя (необязательно) */
	lastName?: string
	/** Ссылка на аватар пользователя (необязательно) */
	picture?: string
	/** Google ID для OAuth авторизации (необязательно) */
	googleId?: string
	/** Дата создания аккаунта */
	createdAt: Date
	/** Дата последнего обновления */
	updatedAt: Date
	/** Роли пользователя в системе */
	roles: string[]
}

/** Ответ сервера при успешной авторизации */
export interface AuthResponse {
	/** JWT токен доступа */
	accessToken: string
	/** Токен обновления (необязательно) */
	refreshToken?: string
	/** Данные пользователя */
	user: User
}

/** Тип для формы пользователя без ID, но с паролем */
export type TypeUserForm = Omit<User, 'id'> & { password: string | undefined }

/** Тип метода аутентификации */
export type AuthMethod = 'email' | 'phone'
