
import { collapsedSlice } from './collapsed/collapsed.slice'
import { userSlice } from './user/user.slice'
export const rootActions = {
	...userSlice.actions,
	...collapsedSlice.actions

}
