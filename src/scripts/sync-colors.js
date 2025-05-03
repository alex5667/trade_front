// This script syncs colors between colors.scss and color.constants.ts
// Usage: node sync-colors.js

const fs = require('fs')
const path = require('path')

const colorsScssPath = path.resolve(__dirname, '../styles/colors.scss')
const colorConstantsPath = path.resolve(
	__dirname,
	'../constants/color.constants.ts'
)

// Read files
function readColorConstants() {
	try {
		const content = fs.readFileSync(colorConstantsPath, 'utf8')
		const colorsMatch = content.match(/export const COLORS = \{[\s\S]*?\}/)

		if (!colorsMatch) {
			throw new Error('Could not find COLORS object in color.constants.ts')
		}

		const colorsObject = {}

		// Extract color definitions from the COLORS object
		const colorLines = colorsMatch[0].split('\n').slice(1, -1)

		colorLines.forEach(line => {
			const match = line.match(/'([a-zA-Z0-9-]+)':\s+'(#[A-Fa-f0-9]+)'/)
			if (match) {
				const [, name, color] = match
				colorsObject[name.toLowerCase()] = color.toLowerCase()
			} else {
				// Try alternative format with quotes
				const altMatch = line.match(
					/(["'])([a-zA-Z0-9-]+)\1:\s+['"]?(#[A-Fa-f0-9]+)['"]?/
				)
				if (altMatch) {
					const [, , name, color] = altMatch
					colorsObject[name.toLowerCase()] = color.toLowerCase()
				}
			}
		})

		return colorsObject
	} catch (err) {
		console.error('Error reading color constants:', err)
		return {}
	}
}

// Extract colors from colors.scss
function readColorsSCSS() {
	try {
		const content = fs.readFileSync(colorsScssPath, 'utf8')
		const colorsMatch = content.match(/\$colors:\s*\([\s\S]*?\);/)

		if (!colorsMatch) {
			throw new Error('Could not find $colors map in colors.scss')
		}

		const colorsObject = {}

		// Extract color definitions from the $colors map
		const colorLines = colorsMatch[0].split('\n').slice(1, -1)

		colorLines.forEach(line => {
			const match = line.match(/"([a-zA-Z0-9-]+)":\s+(#[A-Fa-f0-9]+)/)
			if (match) {
				const [, name, color] = match
				colorsObject[name.toLowerCase()] = color.toLowerCase()
			}
		})

		return colorsObject
	} catch (err) {
		console.error('Error reading SCSS colors:', err)
		return {}
	}
}

// Compare colors and report differences
function compareColors() {
	const constantsColors = readColorConstants()
	const scssColors = readColorsSCSS()

	console.log(
		`Found ${Object.keys(constantsColors).length} colors in color.constants.ts`
	)
	console.log(`Found ${Object.keys(scssColors).length} colors in colors.scss`)

	// Find colors in constants but not in SCSS
	const missingInSCSS = Object.keys(constantsColors).filter(
		key => !scssColors[key]
	)

	// Find colors in SCSS but not in constants
	const missingInConstants = Object.keys(scssColors).filter(
		key => !constantsColors[key]
	)

	// Find colors with different values
	const differentValues = Object.keys(constantsColors).filter(
		key =>
			scssColors[key] &&
			scssColors[key].toLowerCase() !== constantsColors[key].toLowerCase()
	)

	if (missingInSCSS.length > 0) {
		console.log(`\nColors missing in colors.scss:`)
		missingInSCSS.forEach(key => {
			console.log(`  "${key}": ${constantsColors[key]},`)
		})
	}

	if (missingInConstants.length > 0) {
		console.log(`\nColors missing in color.constants.ts:`)
		missingInConstants.forEach(key => {
			console.log(`  '${key}': '${scssColors[key]}',`)
		})
	}

	if (differentValues.length > 0) {
		console.log(`\nColors with different values:`)
		differentValues.forEach(key => {
			console.log(
				`  ${key}: ${constantsColors[key]} (constants) vs ${scssColors[key]} (scss)`
			)
		})
	}

	if (
		missingInSCSS.length === 0 &&
		missingInConstants.length === 0 &&
		differentValues.length === 0
	) {
		console.log('\nAll colors are synchronized between files!')
		return true
	}

	return false
}

// Add missing colors to color.constants.ts
function updateColorConstants() {
	try {
		const constantsColors = readColorConstants()
		const scssColors = readColorsSCSS()

		// Find colors in SCSS but not in constants
		const missingInConstants = Object.keys(scssColors).filter(
			key => !constantsColors[key]
		)

		if (missingInConstants.length === 0) {
			console.log('No new colors to add to color.constants.ts')
			return
		}

		let content = fs.readFileSync(colorConstantsPath, 'utf8')

		// Find the index of the last property before the closing brace
		const matches = [
			...content.matchAll(
				/(['"])([a-zA-Z0-9-]+)\1:\s+['"]?(#[A-Fa-f0-9]+)['"]?/g
			)
		]
		if (matches.length === 0) {
			throw new Error(
				'Could not find any color properties in color.constants.ts'
			)
		}

		// Find the last match position
		const lastMatch = matches[matches.length - 1]
		const lastIndex = content.indexOf(lastMatch[0]) + lastMatch[0].length

		// Create the new properties
		const replacementLines = missingInConstants.map(
			key => `\t'${key}': '${scssColors[key]}',`
		)

		// Find the closing brace of the COLORS object
		const lastBraceIndex = content.lastIndexOf('}')

		if (lastBraceIndex === -1) {
			throw new Error('Could not find closing brace in color.constants.ts')
		}

		// Insert new color definitions before the closing brace
		content =
			content.slice(0, lastBraceIndex) +
			'\n\t' +
			replacementLines.join('\n\t') +
			'\n' +
			content.slice(lastBraceIndex)

		fs.writeFileSync(colorConstantsPath, content)
		console.log(
			`Added ${missingInConstants.length} new colors to color.constants.ts`
		)
	} catch (err) {
		console.error('Error updating color constants:', err)
	}
}

// Add missing colors to colors.scss
function updateColorsSCSS() {
	try {
		const constantsColors = readColorConstants()
		const scssColors = readColorsSCSS()

		// Find colors in constants but not in SCSS
		const missingInSCSS = Object.keys(constantsColors).filter(
			key => !scssColors[key]
		)

		if (missingInSCSS.length === 0) {
			console.log('No new colors to add to colors.scss')
			return
		}

		let content = fs.readFileSync(colorsScssPath, 'utf8')
		const replacementLines = missingInSCSS.map(
			key => `\t"${key}": ${constantsColors[key]},`
		)

		// Find the closing parenthesis of the $colors map
		const lastParenIndex = content.indexOf(');')

		if (lastParenIndex === -1) {
			throw new Error('Could not find closing parenthesis in colors.scss')
		}

		// Insert new color definitions before the closing parenthesis
		content =
			content.slice(0, lastParenIndex) +
			'\n\t' +
			replacementLines.join('\n\t') +
			'\n' +
			content.slice(lastParenIndex)

		fs.writeFileSync(colorsScssPath, content)
		console.log(`Added ${missingInSCSS.length} new colors to colors.scss`)
	} catch (err) {
		console.error('Error updating SCSS colors:', err)
	}
}

// Main execution
console.log('Comparing color definitions...')
const isSync = compareColors()

if (!isSync) {
	const answer = 'y' // For automation, assume yes

	if (answer.toLowerCase() === 'y') {
		console.log('\nSynchronizing colors...')
		updateColorConstants()
		updateColorsSCSS()

		console.log('\nRe-comparing after synchronization:')
		compareColors()
	}
}

console.log('\nDone!')
