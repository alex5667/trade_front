import { DishResponse } from '@/types/dish.type'
export const getDishByName = (items: DishResponse[] | undefined, name: string): DishResponse | undefined => {
	return items && items.find(item => item.printName.toLowerCase() === name.toLowerCase())
}