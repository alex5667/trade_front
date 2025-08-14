export interface Role {
	id: number
	name: string
	createdAt: string
	updatedAt: string
}

export interface User {
	id: number
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