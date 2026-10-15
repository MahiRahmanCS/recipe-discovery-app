import type { Meal } from '../types/meal'

export function createRecipeCard(meal: Meal): HTMLElement {
  const card = document.createElement('article')
  card.className = 'recipe-card'

  const media = document.createElement('div')
  media.className = 'recipe-media'
  const fallback = document.createElement('span')
  fallback.className = 'recipe-image-fallback'
  fallback.textContent = 'A little kitchen inspiration'
  fallback.setAttribute('aria-hidden', 'true')
  media.append(fallback)

  if (meal.strMealThumb) {
    const image = document.createElement('img')
    image.src = meal.strMealThumb
    image.alt = meal.strMeal
    image.loading = 'lazy'
    image.decoding = 'async'
    image.width = 700
    image.height = 700
    image.addEventListener('error', () => image.remove(), { once: true })
    media.append(image)
  }

  if (meal.strCategory) {
    const category = document.createElement('span')
    category.className = 'recipe-category'
    category.textContent = meal.strCategory
    media.append(category)
  }

  const body = document.createElement('div')
  body.className = 'recipe-card-body'
  const origin = document.createElement('p')
  origin.className = 'recipe-origin'
  origin.textContent = meal.strArea ? `${meal.strArea} kitchen` : 'A LITTLE RECIPE INSPIRATION'
  const title = document.createElement('h3')
  title.textContent = meal.strMeal
  body.append(origin, title)
  card.append(media, body)
  return card
}
