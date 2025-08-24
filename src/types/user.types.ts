export interface Role {
	id: string
	name: string
	createdAt: string
	updatedAt: string
}

export interface User {
	id: string
	email?: string
	firstName?: string
	lastName?: string
	picture?: string
	password?: string
	googleId?: string
	phone?: string
	createdAt: string
	updatedAt: string
	roles?: Role[]
} 