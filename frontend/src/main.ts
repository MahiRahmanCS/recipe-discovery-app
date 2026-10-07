import './style.css'
import { searchMeals } from './api/mealDb'
import { createRecipeCard } from './components/recipeCard'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('The #app element is missing from index.html.')
}

app.innerHTML = `
  <main class="container">
    <header>
      <h1>GrubHub</h1>
      <p>Find your next favourite meal.</p>
    </header>

    <form id="search-form" role="search">
      <label for="search-input">Search recipes by name</label>

      <div class="search-row">
        <input
          id="search-input"
          name="search"
          type="search"
          placeholder="Try chicken or pasta"
          maxlength="100"
          required
        />

        <button type="submit">Search</button>
      </div>
    </form>

    <p id="status" role="status" aria-live="polite">
      Enter a recipe name to get started.
    </p>

    <section
      id="results"
      class="recipe-grid"
      aria-label="Recipe results"
      aria-busy="false"
    ></section>
  </main>
`

const form = app.querySelector<HTMLFormElement>('#search-form')!
const input = app.querySelector<HTMLInputElement>('#search-input')!
const status = app.querySelector<HTMLParagraphElement>('#status')!
const results = app.querySelector<HTMLElement>('#results')!

let activeRequest: AbortController | undefined

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  // Stop an earlier search so it cannot replace newer results.
  activeRequest?.abort()

  const request = new AbortController()
  activeRequest = request

  const query = input.value.trim()
  results.replaceChildren()

  if (!query) {
    status.textContent = 'Enter a recipe name.'
    results.setAttribute('aria-busy', 'false')
    input.focus()
    return
  }

  status.textContent = 'Finding recipes…'
  results.setAttribute('aria-busy', 'true')

  try {
    const meals = await searchMeals(query, request.signal)

    if (activeRequest !== request) return

    results.replaceChildren(...meals.map(createRecipeCard))

    status.textContent = meals.length
      ? `${meals.length} recipe${meals.length === 1 ? '' : 's'} found.`
      : 'No recipes found. Try a different name.'
  } catch {
    if (request.signal.aborted || activeRequest !== request) return

    status.textContent =
      'Could not load recipes. Check your connection and press Search to retry.'
  } finally {
    if (activeRequest === request) {
      results.setAttribute('aria-busy', 'false')
    }
  }
})