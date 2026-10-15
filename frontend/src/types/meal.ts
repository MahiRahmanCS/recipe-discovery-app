export interface MealSummary {
  idMeal: string
  strMeal: string
  strMealThumb: string | null
}

export interface Meal extends MealSummary {
  strCategory: string | null
  strArea: string | null
  strInstructions: string | null
}

export interface MealResponse {
  meals: Meal[] | null
}

export interface MealSummaryResponse {
  meals: MealSummary[] | null
}

export interface MealCategory {
  idCategory: string
  strCategory: string
  strCategoryThumb: string
  strCategoryDescription: string
}

export interface MealCategoryResponse {
  categories: MealCategory[] | null
}
