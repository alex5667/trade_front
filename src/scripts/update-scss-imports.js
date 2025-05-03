// This script can be used to update all SCSS files in the signal-table directory
// to use the new color system from color.constants.ts
// Usage: node update-scss-imports.js

const fs = require('fs')
const path = require('path')

// Root directory of the signal-table components
const rootDir = path.resolve(__dirname, '../components/signal-table')

// Import line to add to each file
const colorImport = '@use "@/styles/signal-table-colors.scss" as stColors;'

// Find all SCSS files recursively
function findScssFiles(dir, fileList = []) {
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

	return fileList
}

// Update each SCSS file to include the color variables import
function updateScssFiles(files) {
	files.forEach(filePath => {
		let content = fs.readFileSync(filePath, 'utf8')

		// Check if the file already has the import
		if (!content.includes('signal-table-colors.scss')) {
			// Insert the import after existing imports
			const lines = content.split('\n')
			let importInserted = false

			for (let i = 0; i < lines.length; i++) {
				// If we find an @use or @import line
				if (
					(lines[i].includes('@use') || lines[i].includes('@import')) &&
					!importInserted
				) {
					// Check next line
					if (
						i + 1 < lines.length &&
						!(lines[i + 1].includes('@use') || lines[i + 1].includes('@import'))
					) {
						// Insert our import after this line
						lines.splice(i + 1, 0, colorImport)
						importInserted = true
						break
					}
				}
			}

			// If no imports were found, add to top of file
			if (!importInserted) {
				lines.unshift(colorImport)
			}

			// Write the updated content back to the file
			fs.writeFileSync(filePath, lines.join('\n'))
			console.log(`Updated: ${path.relative(process.cwd(), filePath)}`)
		} else {
			console.log(
				`Skipped (already updated): ${path.relative(process.cwd(), filePath)}`
			)
		}
	})
}

// Main execution
const scssFiles = findScssFiles(rootDir)
console.log(`Found ${scssFiles.length} SCSS files to process`)
updateScssFiles(scssFiles)
console.log('Update complete!')
