// This script sets CSS variables based on color.constants.ts
import { COLORS } from '../constants/color.constants'

export function setColorVariables() {
	// Set CSS variables for all colors in the COLORS object
	Object.entries(COLORS).forEach(([key, value]) => {
		document.documentElement.style.setProperty(`--color-${key}`, value)
	})
}

// Auto-initialize on import (can be called explicitly in _app.tsx if needed)
if (typeof window !== 'undefined') {
	setColorVariables()
} 