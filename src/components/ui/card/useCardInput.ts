import { useCreateDishCategoryMutation, useUpdateDishCategoryMutation } from '@/services/dish-category.service'
import { useCreateIngredientMutation, useUpdateIngredientMutation } from '@/services/ingredient.service'
import { useCreateInstitutionMutation, useUpdateInstitutionMutation } from '@/services/institution.service'
import { useCreateMealMutation, useUpdateMealMutation } from '@/services/meal.service'
import { DishCategoryResponse } from '@/types/dishCategory.type'
import { IngredientResponse } from '@/types/ingredient.type'
import { InstitutionResponse } from '@/types/institution.type'
import { MealResponse } from '@/types/meal.type'
import { debounce } from '@/utils/debounce'
import { MutableRefObject, SetStateAction, useCallback, useEffect, useState } from 'react'
const fetchQueries = {
  institution: [useUpdateInstitutionMutation, useCreateInstitutionMutation],
  meal: [useUpdateMealMutation, useCreateMealMutation],
  dishCategory: [useUpdateDishCategoryMutation, useCreateDishCategoryMutation],
  ingredient: [useUpdateIngredientMutation, useCreateIngredientMutation]
}
type FetchQueryData =
  | (Partial<Omit<InstitutionResponse, "id" | "createdAt" | "updatedAt">> & { id?: string })
  | (Partial<Omit<MealResponse, "id" | "updatedAt">> & { id?: string })
  | (Partial<Omit<DishCategoryResponse, "id" | "createdAt" | "updatedAt">> & { id?: string })
  | (Partial<Omit<IngredientResponse, "id" | "createdAt" | "updatedAt">> & { id?: string })
type UseCardInputProps<T> = {
  inputRef: MutableRefObject<HTMLInputElement | null>
  data: T
  fetchFunction: keyof typeof fetchQueries | string
  setItem?: (value: SetStateAction<T>) => void
  keyName?: keyof T
  defaultValue?: string | number

}

export function useCardInput<T extends FetchQueryData, K extends keyof T>({
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
    if (keyName) {
      setInputValue(data[keyName] as T[K])
    }
    if (defaultValue) {
      setInputValue(defaultValue)
    }
  }, [data, keyName, defaultValue])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedInputChange = useCallback(
    debounce(async (value: any) => {
      try {
        let updatedData = { ...data }
        if (keyName) {
          updatedData = { ...data, [keyName]: value }
        }

        if ((data as any)?.id) {
          const item = await updateItem({
            id: (data as any).id,
            data: updatedData,
          }).unwrap()
          if (JSON.stringify(item) !== JSON.stringify(updatedData)) {
            setItem && setItem((prevItem) => ({ ...prevItem, ...item }))
          }
        } else {
          const item = await createItem(updatedData).unwrap()
          setItem && setItem(() => item)
        }
      } catch (error) {
        console.error('Ошибка при обновлении/создании:', error)
      }
    }, 700),
    [data, keyName, updateItem, createItem, inputRef]
  )

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value as T[K]
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
