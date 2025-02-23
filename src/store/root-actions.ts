
import { collapsedSlice } from './collapsed/collapsed.slice'
import { dishSlice } from './dish/dish.slice'
import { ingredientAliasSlice } from './ingredient-alias/ingredient-alias.slice'
import { ingredientSlice } from './ingredient/ingredient.slice'
import { institutionSlice } from './institution/institution.slice'
import { mealConsumptionSlice } from './meal-consumption/meal-consumption.slice'
import { mealSlice } from './meal/meal.slice'
import { menuItemSlice } from './menuItem/menu-item.slice'
import { purchasingSlice } from './purchasing/purchasing.slice'
import { sidebarSlice } from './sidebar/sidebar.slice'
import { userSlice } from './user/user.slice'
export const rootActions = {
	...userSlice.actions,
	...collapsedSlice.actions,
	...menuItemSlice.actions,
	...mealSlice.actions,
	...mealConsumptionSlice.actions,
	...sidebarSlice.actions,
	...institutionSlice.actions,
	...dishSlice.actions,
	...ingredientSlice.actions,
	...ingredientAliasSlice.actions,
	...purchasingSlice.actions,

}
