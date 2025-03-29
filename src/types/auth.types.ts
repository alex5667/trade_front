export interface AuthForm {
	email: string
	password: string
}

export interface User {
	id: number
	email: string
	firstName?: string
	lastName?: string
	picture?: string
	googleId?: string
	createdAt: Date
	updatedAt: Date
	roles: string[]
}

export interface AuthResponse {
	accessToken: string
	refreshToken?: string
	user: User
}

export type TypeUserForm = Omit<User, 'id'> & { password: string | undefined }
