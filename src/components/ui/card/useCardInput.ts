import { useCreateDishCategoryMutation, useUpdateDishCategoryMutation } from '@/services/dish-category.service'
import { useCreateIngredientMutation, useUpdateIngredientMutation } from '@/services/ingredient.service'
import { useCreateInstitutionMutation, useUpdateInstitutionMutation } from '@/services/institution.service'
import { useCreateMealMutation, useUpdateMealMutation } from '@/services/meal.service'
import { DishCategoryFormState } from '@/types/dishCategory.type'
import { IngredientFormState } from '@/types/ingredient.type'
import { InstitutionFormState } from '@/types/institution.type'
import { MealFormState } from '@/types/meal.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'
const fetchQueries = {
  institution: [useUpdateInstitutionMutation, useCreateInstitutionMutation],
  meal: [useUpdateMealMutation, useCreateMealMutation],
  dishCategory: [useUpdateDishCategoryMutation, useCreateDishCategoryMutation],
  ingredient: [useUpdateIngredientMutation, useCreateIngredientMutation]
}
type FetchQueryData =
  | InstitutionFormState
  | MealFormState
  | DishCategoryFormState
  | IngredientFormState



type UseCardInputProps<T> = {
  inputRef: MutableRefObject<HTMLInputElement | null>
  data: T
  fetchFunction: keyof typeof fetchQueries | string
  setItem?: (value: SetStateAction<T>) => void
  keyName?: keyof T
  defaultValue?: string | number

}

export function useCardInput<T, K extends keyof T>({
  inputRef,
  data,
  setItem,
  keyName,
  defaultValue,
  fetchFunction,
}: UseCardInputProps<T>) {
  const [inputValue, setInputValue] = useState(
    keyName ? (data[keyName] as T[K]) : defaultValue
  )
  const updateHook = fetchQueries[fetchFunction as keyof typeof fetchQueries][0]
  const createHook = fetchQueries[fetchFunction as keyof typeof fetchQueries][1]

  const [updateItem] = updateHook()
  const [createItem] = createHook()

  useEffect(() => {
    if (keyName && data[keyName] !== undefined && data[keyName] !== null) {
      setInputValue(data[keyName] as T[K])
    } else if (defaultValue !== undefined) {
      setInputValue(defaultValue)
    }

  }, [data, keyName, defaultValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedInputChange = useCallback(
    debounce(async (value: any) => {
      try {
        let updatedData = { ...data }
        if (keyName && value !== undefined && value !== null) {
          updatedData = { ...data, [keyName]: value }
        }


        if ((data as any)?.id) {
          const item = await updateItem({
            id: (data as any).id,
            data: updatedData as FetchQueryData,
          }).unwrap()
          if (JSON.stringify(item) !== JSON.stringify(updatedData)) {
            setItem && setItem((prevItem) => ({ ...prevItem, ...item }))
          }
        } else {
          const item = await createItem(updatedData as any).unwrap()
          setItem && setItem(() => item as T)
        }
      } catch (error) {
        console.error('Ошибка при обновлении/создании:', error)
      }
    }, 700),
    [data, keyName, updateItem, createItem, inputRef]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value as T[K] || ''
      setInputValue(newValue)
      debouncedInputChange(newValue)
    },
    [debouncedInputChange]
  )

  return {
    inputValue,
    handleChange,
    setInputValue,
  }
}
