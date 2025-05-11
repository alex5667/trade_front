'use client'

/**
 * API Test Utilities
 * ------------------
 * Functions to test API endpoints and data formats
 */

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api'

/**
 * Test API Health
 * Checks if the API is online and responding
 */
export const testApiHealth = async (): Promise<{ status: string; message: string }> => {
	try {
		const response = await fetch(`${API_BASE_URL}/health`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			return {
				status: 'error',
				message: `API health check failed with status: ${response.status}`
			}
		}

		const data = await response.json()
		return {
			status: 'success',
			message: `API is online. Response: ${JSON.stringify(data)}`
		}
	} catch (error) {
		return {
			status: 'error',
			message: `API health check failed: ${error instanceof Error ? error.message : String(error)}`
		}
	}
}

/**
 * Test Specific API Endpoint
 * Tests a specific API endpoint with optional data
 */
export const testApiEndpoint = async (
	endpoint: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
	data?: any,
	token?: string
): Promise<{ status: string; data?: any; error?: string }> => {
	try {
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		}

		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}

		const options: RequestInit = {
			method,
			headers
		}

		if (data && (method === 'POST' || method === 'PUT')) {
			options.body = JSON.stringify(data)
		}

		const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
		const responseData = await response.json()

		if (!response.ok) {
			return {
				status: 'error',
				error: `API request failed with status: ${response.status}`,
				data: responseData
			}
		}

		return {
			status: 'success',
			data: responseData
		}
	} catch (error) {
		return {
			status: 'error',
			error: `API request failed: ${error instanceof Error ? error.message : String(error)}`
		}
	}
}

/**
 * Test Authentication
 * Tests login functionality and returns token if successful
 */
export const testAuthentication = async (
	email: string,
	password: string
): Promise<{ status: string; token?: string; error?: string }> => {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})

		const data = await response.json()

		if (!response.ok) {
			return {
				status: 'error',
				error: `Authentication failed with status: ${response.status}`,
				token: undefined
			}
		}

		return {
			status: 'success',
			token: data.accessToken || data.token
		}
	} catch (error) {
		return {
			status: 'error',
			error: `Authentication failed: ${error instanceof Error ? error.message : String(error)}`
		}
	}
}

/**
 * Test Market Data API
 * Tests the market data API endpoints
 */
export const testMarketDataApi = async (
	token?: string
): Promise<{ status: string; results: any[]; errors: any[] }> => {
	const endpoints = [
		{ name: 'Markets List', path: '/markets' },
		{ name: 'Symbols List', path: '/symbols' },
		{ name: 'Top Gainers', path: '/top/gainers' },
		{ name: 'Top Losers', path: '/top/losers' },
		{ name: 'Top Volume', path: '/top/volume' }
	]

	const results: any[] = []
	const errors: any[] = []

	for (const endpoint of endpoints) {
		try {
			const result = await testApiEndpoint(endpoint.path, 'GET', undefined, token)

			results.push({
				name: endpoint.name,
				path: endpoint.path,
				status: result.status,
				data: result.data
			})

			if (result.status === 'error') {
				errors.push({
					name: endpoint.name,
					path: endpoint.path,
					error: result.error
				})
			}
		} catch (error) {
			errors.push({
				name: endpoint.name,
				path: endpoint.path,
				error: error instanceof Error ? error.message : String(error)
			})
		}
	}

	return {
		status: errors.length === 0 ? 'success' : 'partial',
		results,
		errors
	}
}

/**
 * Run a comprehensive API test suite
 */
export const runApiTestSuite = async (): Promise<{
	overallStatus: string
	health: any
	auth?: any
	marketData?: any
}> => {
	console.log('Starting API test suite...')

	// Step 1: Test API health
	console.log('Testing API health...')
	const health = await testApiHealth()

	// If health check fails, we can't proceed with other tests
	if (health.status === 'error') {
		console.error('API health check failed. Cannot proceed with further tests.')
		return {
			overallStatus: 'failed',
			health
		}
	}

	// Step 2: Test authentication
	console.log('Testing authentication...')
	const auth = await testAuthentication('test@example.com', 'password')

	// Step 3: Test market data API
	console.log('Testing market data API...')
	const marketData = await testMarketDataApi(auth.token)

	// Determine overall status
	const overallStatus =
		health.status === 'success' &&
			(auth.status === 'success' || auth.status === undefined) &&
			(marketData.errors.length === 0 || marketData.status === 'partial')
			? 'success'
			: 'failed'

	return {
		overallStatus,
		health,
		auth,
		marketData
	}
} 