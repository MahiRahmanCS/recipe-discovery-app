import type {
  Meal,
  MealCategory,
  MealCategoryResponse,
  MealResponse,
  MealSummaryResponse,
} from '../types/meal'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/'

async function requestMealDb<T>(
  endpoint: string,
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(endpoint, BASE_URL)
  url.search = new URLSearchParams(params).toString()

  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error('Could not load recipes. Please try again.')
  }

  return response.json()
}

export async function searchMeals(
  query: string,
  signal?: AbortSignal,
): Promise<Meal[]> {
  const data = await requestMealDb<MealResponse>(
    'search.php',
    { s: query.trim() },
    signal,
  )

  return data.meals ?? []
}

export async function getFeaturedMeals(signal?: AbortSignal): Promise<Meal[]> {
  const data = await requestMealDb<MealResponse>(
    'search.php',
    { f: 'b' },
    signal,
  )

  return data.meals ?? []
}

export async function getCategories(signal?: AbortSignal): Promise<MealCategory[]> {
  const data = await requestMealDb<MealCategoryResponse>(
    'categories.php',
    {},
    signal,
  )

  return data.categories ?? []
}

export async function getMealsByCategory(
  category: string,
  signal?: AbortSignal,
): Promise<Meal[]> {
  const selectedCategory = category.trim()
  const data = await requestMealDb<MealSummaryResponse>(
    'filter.php',
    { c: selectedCategory },
    signal,
  )

  return (data.meals ?? []).map((meal) => ({
    ...meal,
    strCategory: selectedCategory,
    strArea: null,
    strInstructions: null,
  }))
}
