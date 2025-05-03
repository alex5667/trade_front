// This script updates all SCSS modules to use variables.scss as vars import
// Usage: node update-scss-variables.js

const fs = require('fs')
const path = require('path')

// Root directory of the components
const rootDir = path.resolve(__dirname, '../components')

// Import line to add
const varsImport = '@use "@/styles/variables.scss" as vars;'

// Variable pattern to replace
const variablePattern = /\$([a-zA-Z]+)(?!-)/g

// Find all SCSS files recursively
function findScssFiles(dir, fileList = []) {
	try {
		const files = fs.readdirSync(dir)

		files.forEach(file => {
			const filePath = path.join(dir, file)
			const stat = fs.statSync(filePath)

			if (stat.isDirectory()) {
				findScssFiles(filePath, fileList)
			} else if (file.endsWith('.scss')) {
				fileList.push(filePath)
			}
		})
	} catch (err) {
		console.error(`Error reading directory ${dir}:`, err)
	}

	return fileList
}

// Update each SCSS file to use the variables import
function updateScssFiles(files) {
	const skipVars = ['$colors']
	const breapoints = [
		'mobile',
		'tablet',
		'mobileSmall',
		'minWidth',
		'maxWidth',
		'maxWidthContainer',
		'containerPadding',
		'containerWidth',
		'borderRed',
		'secondary',
		'borderColor',
		'white',
		'darkening'
	]

	files.forEach(filePath => {
		try {
			let content = fs.readFileSync(filePath, 'utf8')
			let hasChanged = false
			let needsImport = false

			// Check if file contains any breakpoint variables
			const hasBreakpoints = breapoints.some(
				bp => content.includes(`$${bp}`) && !content.includes(`vars.$${bp}`)
			)

			// Add the vars import if file contains breakpoints and doesn't already have the import
			if (hasBreakpoints && !content.includes(varsImport)) {
				needsImport = true

				// Check if there are already imports
				const importLines = content.match(/@use.*?;/g) || []

				if (importLines.length > 0) {
					// Insert after the first import
					content = content.replace(
						importLines[0],
						`${importLines[0]}\n${varsImport}`
					)
				} else {
					// Insert at the top
					content = `${varsImport}\n${content}`
				}

				hasChanged = true
			}

			// Replace $variable with vars.$variable for breakpoint variables
			if (hasBreakpoints) {
				// Get all variables used in the file
				const matches = [...content.matchAll(/\$([a-zA-Z]+)(?!-)/g)]
				const uniqueVars = [...new Set(matches.map(m => m[0]))]

				// Only replace variables that exist in variables.scss
				uniqueVars.forEach(varName => {
					if (
						breapoints.includes(varName.substring(1)) &&
						!skipVars.includes(varName)
					) {
						const regex = new RegExp(`${varName}(?![a-zA-Z0-9-])`, 'g')
						content = content.replace(regex, `vars.${varName}`)
						hasChanged = true
					}
				})
			}

			// Write the updated content back to the file
			if (hasChanged) {
				fs.writeFileSync(filePath, content)
				console.log(`Updated: ${path.relative(process.cwd(), filePath)}`)
			} else {
				console.log(
					`No changes needed: ${path.relative(process.cwd(), filePath)}`
				)
			}
		} catch (err) {
			console.error(`Error updating file ${filePath}:`, err)
		}
	})
}

// Main execution
const scssFiles = findScssFiles(rootDir)
console.log(`Found ${scssFiles.length} SCSS files to process`)
updateScssFiles(scssFiles)
console.log('Update complete!')
