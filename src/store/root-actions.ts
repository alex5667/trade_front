
import { collapsedSlice } from './collapsed/collapsed.slice'
import { mealSlice } from './meal/meal.slice'
import { menuItemSlice } from './menuItem/menu-item.slice'
import { userSlice } from './user/user.slice'

export const rootActions = {
	...userSlice.actions,
	...collapsedSlice.actions,
	...menuItemSlice.actions,
	...mealSlice.actions

}
