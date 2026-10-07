import type { Meal, MealResponse } from '../types/meal'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/'

export async function searchMeals(
  query: string,
  signal?: AbortSignal,
): Promise<Meal[]> {
  const params = new URLSearchParams({
    s: query.trim(),
  })

  const response = await fetch(
    `${BASE_URL}search.php?${params}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error('Could not load recipes. Please try again.')
  }

  const data: MealResponse = await response.json()

  return data.meals ?? []
}