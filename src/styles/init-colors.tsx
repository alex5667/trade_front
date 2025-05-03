'use client'

import { useEffect } from 'react'

import { COLORS } from '@/constants/color.constants'

/**
 * Component to set CSS color variables from color.constants.ts
 * Include this in the layout.tsx or similar component
 */
export function InitColors() {
	useEffect(() => {
		// Set CSS variables in the root element
		Object.entries(COLORS).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value)
		})
	}, [])

	// This component doesn't render anything
	return null
}

export default InitColors
