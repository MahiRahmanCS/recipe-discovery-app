import type { Meal } from '../types/meal'

export function createRecipeCard(meal: Meal): HTMLElement {
  const card = document.createElement('article')
  card.className = 'recipe-card'

  if (meal.strMealThumb) {
    const image = document.createElement('img')
    image.src = meal.strMealThumb
    image.alt = meal.strMeal
    image.loading = 'lazy'

    image.addEventListener('error', () => {
      image.remove()
    }, { once: true })

    card.append(image)
  }

  const title = document.createElement('h2')
  title.textContent = meal.strMeal

  const description = document.createElement('p')
  description.textContent = [
    meal.strCategory,
    meal.strArea,
  ].filter(Boolean).join(' • ')

  card.append(title, description)

  return card
}