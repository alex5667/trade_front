// This script updates all SCSS modules to use colors.scss instead of color-variables.scss or signal-table-colors.scss
// Usage: node update-scss-modules.js

const fs = require('fs')
const path = require('path')

// Root directory of the components
const rootDir = path.resolve(__dirname, '../components')

// Import lines to replace
const oldImports = [
	'@use "@/styles/color-variables.scss" as colors;',
	'@use "@/styles/signal-table-colors.scss" as stColors;',
	'@use "@/styles/variables.scss" as *;'
]

// New import line
const newImport = '@use "@/styles/colors.scss" as colors;'

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

// Update each SCSS file to use the new import
function updateScssFiles(files) {
	files.forEach(filePath => {
		try {
			let content = fs.readFileSync(filePath, 'utf8')
			let hasChanged = false

			// First, remove the old imports
			oldImports.forEach(oldImport => {
				if (content.includes(oldImport)) {
					content = content.replace(oldImport, '')
					hasChanged = true
				}
			})

			// Then, add the new import at the top
			if (hasChanged && !content.includes(newImport)) {
				const lines = content.split('\n')

				// Find the first non-empty line
				let insertIndex = 0
				for (let i = 0; i < lines.length; i++) {
					if (lines[i].trim() !== '') {
						insertIndex = i
						break
					}
				}

				// Insert the new import
				lines.splice(insertIndex, 0, newImport)
				content = lines.join('\n')
			}

			// Update stColors references to colors
			if (content.includes('stColors.$')) {
				content = content.replace(/stColors\.\$/g, 'colors.$')
				hasChanged = true
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
