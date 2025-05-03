# Color System Documentation

## Overview

This project uses a centralized color system to ensure consistency throughout the application. All colors are defined in a single source of truth: `src/constants/color.constants.ts`.

## How it works

1. **Single Source of Truth**: All colors are defined in `src/constants/color.constants.ts` as JavaScript constants.
2. **Tailwind Integration**: Colors are imported into the Tailwind config, making them available as utility classes.
3. **SCSS Variables**: Colors are also available as SCSS variables through `colors.scss`.
4. **CSS Variables**: Colors are set as CSS custom properties at runtime.

## Files Structure

- `src/constants/color.constants.ts` - Primary color definitions
- `src/styles/colors.scss` - Comprehensive SCSS file with all color variables, including component-specific ones
- `src/styles/variables.scss` - Non-color variables like breakpoints, spacing, etc.
- `src/styles/init-colors.tsx` - React component to set CSS variables at runtime
- `src/styles/css-color-variables.ts` - Alternative approach to set CSS variables

## Usage

### In Tailwind Classes

```jsx
<div className='bg-primary text-white'>
	This uses the primary color as background
</div>
```

### In SCSS Files

```scss
@use '@/styles/colors.scss' as colors;

.myClass {
	background-color: colors.$primary;
	color: colors.$text-white;
}
```

### Component-Specific Colors

For components like signal-table, use the semantic variables from colors.scss:

```scss
@use '@/styles/colors.scss' as colors;

.tableHeader {
	background-color: colors.$table-header-bg;
}
```

### Using Breakpoints and Other Variables

For breakpoints and other non-color variables, import variables.scss with a namespace:

```scss
@use '@/styles/variables.scss' as vars;
@use '@/styles/colors.scss' as colors;

.container {
	@media (max-width: vars.$mobile) {
		padding: 0;
	}

	border-color: vars.$borderColor;
	background-color: colors.$bg-primary;
}
```

### Adding New Colors

1. Add the color to `src/constants/color.constants.ts`
2. Add corresponding variable to `src/styles/colors.scss`
3. If component-specific, add semantic variable to the same file

## Automation

- `src/scripts/update-scss-imports.js` - Script to update SCSS files with the correct imports

## CSS Variables

CSS variables are set at runtime and can be accessed in CSS via:

```css
.myClass {
	background-color: var(--color-primary);
}
```

## Initialization

To ensure CSS variables are set, the `InitColors` component is included in the layout:

```jsx
import InitColors from '@/styles/init-colors'

export default function Layout({ children }) {
	return (
		<>
			<InitColors />
			{children}
		</>
	)
}
```
