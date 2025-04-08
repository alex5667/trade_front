import DishCreator from '@/app/i/dishes/DishCreator'
import DishEditor from '@/app/i/dishes/DishEditor'
import IngredientsCreator from '@/app/i/ingredients/IngredientsCreator'
import IngredientsEditor from '@/app/i/ingredients/IngredientsEditor'
import Creator from './creator/Creator'
import Deleter from './creator/Deleter'
import Editor from './creator/Editor'

export const componentMap = {
	ingredient: {
		title: 'ингредиент',
		EditorComponent: IngredientsEditor,
		CreatorComponent: IngredientsCreator,
		DeleterComponent: Deleter
	},
	institution: {
		title: 'точку выдачи',
		EditorComponent: Editor,
		CreatorComponent: Creator,
		DeleterComponent: Deleter
	},
	meal: {
		title: 'прием пищи',
		EditorComponent: Editor,
		CreatorComponent: Creator,
		DeleterComponent: Deleter
	},
	dishCategory: {
		title: 'категорию',
		EditorComponent: Editor,
		CreatorComponent: Creator,
		DeleterComponent: Deleter
	},
	dish: {
		title: 'блюдо',
		EditorComponent: DishEditor,
		CreatorComponent: DishCreator,
		DeleterComponent: Deleter
	},
	warehouse: {
		title: 'склад',
		EditorComponent: Editor,
		CreatorComponent: Creator,
		DeleterComponent: Deleter
	}
} as const

export type ComponentMapKeys = keyof typeof componentMap
