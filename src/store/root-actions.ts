
import { collapsedSlice } from './collapsed/collapsed.slice'
import { institutionSlice } from './institution/institution.slice'
import { mealSlice } from './meal/meal.slice'
import { mealConsumptionSlice } from './mealConsumption/meal-consumption.slice'
import { menuItemSlice } from './menuItem/menu-item.slice'
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

}
