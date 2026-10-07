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