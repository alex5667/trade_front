import DishCreator from '@/app/i/dishes/DishCreator'
import DishEditor from '@/app/i/dishes/DishEditor'
import IngredientsCreator from '@/app/i/ingredients/IngredientsCreator'
import IngredientsEditor from '@/app/i/ingredients/IngredientsEditor'
import Creator from './creator/Creator'
import Editor from './creator/Editor'

export const componentMap = {
	ingredient: {
		title: 'ингредиент',
		EditorComponent: IngredientsEditor,
		CreatorComponent: IngredientsCreator
	},
	institution: {
		title: 'точку выдачи',
		EditorComponent: Editor,
		CreatorComponent: Creator
	},
	meal: {
		title: 'прием пищи',
		EditorComponent: Editor,
		CreatorComponent: Creator
	},
	dishCategory: {
		title: 'категорию',
		EditorComponent: Editor,
		CreatorComponent: Creator
	},
	dish: {
		title: 'блюдо',
		EditorComponent: DishEditor,
		CreatorComponent: DishCreator
	},
	warehouse: {
		title: 'склад',
		EditorComponent: Editor,
		CreatorComponent: Creator
	}
} as const

export type ComponentMapKeys = keyof typeof componentMap
