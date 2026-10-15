import './style.css'
import { getCategories, getFeaturedMeals, getMealsByCategory, searchMeals } from './api/mealDb'
import { createRecipeCard } from './components/recipeCard'
import type { Meal, MealCategory } from './types/meal'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) throw new Error('The #app element is missing from index.html.')

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const bowl = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 17h22a11 11 0 0 1-22 0Zm4 12h14M11 5c-3 3 3 4 0 7m6-9c-3 3 3 5 0 8m6-6c-3 3 3 4 0 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

app.innerHTML = `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" id="top">
    <div class="page-shell header-inner">
      <a class="brand" href="#top" aria-label="GrubHub home">
        <span class="brand-mark">${bowl}</span>Grub<span class="brand-accent">Hub</span><span class="brand-dot">.</span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="#recipes">Discover</a>
        <a href="#categories">Categories</a>
        <a href="#about">About</a>
      </nav>
      <a class="header-cta" href="#recipe-search">Let's get cooking ${arrow}</a>
    </div>
  </header>

  <main id="main-content">
    <section class="hero page-shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="small-rule"></span> FOR THE LOVE OF GOOD FOOD</p>
        <h1 id="hero-title">A little inspiration.<br>A lot of <em>flavour.</em></h1>
        <p class="hero-description">The best meals start with a little curiosity. Discover recipes from around the world and find your next favourite thing to cook.</p>
        <a class="button button-primary hero-button" href="#recipes">Find your next meal ${arrow}</a>
        <div class="hero-footnote"><span class="footnote-spark" aria-hidden="true">✳</span> For everyday cooks. And everyday cravings.</div>
      </div>
      <div class="hero-visual">
        <div class="hero-photo-frame">
          <img class="hero-photo" src="https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg" alt="Spicy arrabiata penne in a rich tomato sauce" fetchpriority="high" width="700" height="700" />
          <span class="photo-fallback" hidden>A little kitchen inspiration.</span>
        </div>
        <div class="hero-stamp" aria-hidden="true"><span>GOOD FOOD</span><span class="stamp-flower">✳</span><span>GOOD MOOD</span></div>
        <div class="hero-note"><span class="note-icon" aria-hidden="true">${bowl}</span><div><span class="note-label">A LITTLE KITCHEN INSPIRATION</span><p>Spicy arrabiata penne</p><span class="note-detail">Italian · Vegetarian</span></div></div>
        <span class="hero-caption">YOUR NEXT FAVOURITE IS OUT THERE.</span>
      </div>
    </section>

    <section class="search-section page-shell" id="recipe-search" aria-labelledby="search-heading">
      <div class="search-heading"><p class="eyebrow">LET YOUR CRAVING LEAD</p><h2 id="search-heading">Something in mind?</h2></div>
      <div class="search-content">
        <form id="search-form" role="search">
          <label class="visually-hidden" for="search-input">Search recipes by name</label>
          <div class="search-row">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            <input id="search-input" name="search" type="search" placeholder="Search recipes, like pasta or chicken" maxlength="100" required />
            <button class="button button-primary" type="submit">Search ${arrow}</button>
          </div>
        </form>
        <div class="quick-searches"><span>Try a little:</span><button type="button" data-search="chicken">Chicken</button><button type="button" data-search="pasta">Pasta</button><button type="button" data-search="salmon">Salmon</button><button type="button" data-search="curry">Curry</button></div>
      </div>
    </section>

    <section class="categories-section page-shell" id="categories" aria-labelledby="categories-heading">
      <div class="section-heading"><div><p class="eyebrow">THERE'S SOMETHING FOR EVERY APPETITE</p><h2 id="categories-heading">Follow your craving.</h2></div><button class="text-button" id="toggle-categories" type="button" aria-expanded="false" aria-controls="categories-grid" hidden>All categories</button></div>
      <p class="section-intro">Comfort food, something green, or a little sweet treat. Where shall we start?</p>
      <div class="categories-grid" id="categories-grid" aria-busy="true"></div>
      <p class="category-status" id="categories-status" role="status" aria-live="polite"></p>
      <button class="button button-secondary" id="retry-categories" type="button" hidden>Try loading categories again</button>
    </section>

    <section class="recipes-section page-shell" id="recipes" aria-labelledby="results-title">
      <div class="section-heading recipes-heading"><div><p class="eyebrow" id="results-eyebrow">A FRESH DOSE OF INSPIRATION</p><h2 id="results-title">What sounds good tonight?</h2></div><div class="results-controls"><span class="result-count" id="result-count" hidden></span><button class="text-button" id="reset-recipes" type="button" hidden>Show inspiration ${arrow}</button></div></div>
      <p class="results-status" id="status" role="status" aria-live="polite">Finding a little inspiration…</p>
      <div class="recipe-grid" id="results" role="region" aria-label="Recipes" aria-busy="true"></div>
      <div class="results-feedback" id="results-feedback" hidden><span class="feedback-icon" aria-hidden="true">${bowl}</span><h3 id="feedback-title"></h3><p id="feedback-copy"></p></div>
      <button class="button button-secondary retry-button" id="retry-recipes" type="button" hidden>Try again ${arrow}</button>
    </section>

    <section class="about-strip" id="about" aria-labelledby="about-heading"><div class="page-shell about-inner"><span class="about-spark" aria-hidden="true">✳</span><div><p class="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</p><h2 id="about-heading">Less scrolling. More cooking.</h2></div><p>GrubHub is your little corner of kitchen inspiration. Start with a craving, find a recipe, and make it your own.</p></div></section>
  </main>

  <footer class="site-footer page-shell"><a class="brand footer-brand" href="#top">Grub<span class="brand-accent">Hub</span><span class="brand-dot">.</span></a><p>Recipes &amp; food photography from <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer">TheMealDB<span class="visually-hidden"> (opens in a new tab)</span></a>.</p><a class="back-to-top" href="#top">Back to top ↑</a></footer>
`

const form = document.querySelector<HTMLFormElement>('#search-form')!
const input = document.querySelector<HTMLInputElement>('#search-input')!
const status = document.querySelector<HTMLParagraphElement>('#status')!
const results = document.querySelector<HTMLDivElement>('#results')!
const resultsTitle = document.querySelector<HTMLHeadingElement>('#results-title')!
const resultsEyebrow = document.querySelector<HTMLParagraphElement>('#results-eyebrow')!
const resultCount = document.querySelector<HTMLSpanElement>('#result-count')!
const resetButton = document.querySelector<HTMLButtonElement>('#reset-recipes')!
const retryButton = document.querySelector<HTMLButtonElement>('#retry-recipes')!
const feedback = document.querySelector<HTMLDivElement>('#results-feedback')!
const feedbackTitle = document.querySelector<HTMLHeadingElement>('#feedback-title')!
const feedbackCopy = document.querySelector<HTMLParagraphElement>('#feedback-copy')!
const categoriesGrid = document.querySelector<HTMLDivElement>('#categories-grid')!
const categoriesStatus = document.querySelector<HTMLParagraphElement>('#categories-status')!
const categoriesRetry = document.querySelector<HTMLButtonElement>('#retry-categories')!
const categoriesToggle = document.querySelector<HTMLButtonElement>('#toggle-categories')!

type Selection = { kind: 'featured' } | { kind: 'search'; query: string } | { kind: 'category'; category: string }
let currentSelection: Selection = { kind: 'featured' }
let activeRequest: AbortController | undefined
let categories: MealCategory[] = []
let showAllCategories = false

const categoryOrder = ['Chicken', 'Pasta', 'Seafood', 'Vegetarian', 'Beef', 'Dessert', 'Vegan', 'Breakfast']

function scrollToRecipes() {
  document.querySelector('#recipes')!.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  })
}

function updateCategorySelection() {
  for (const button of categoriesGrid.querySelectorAll<HTMLButtonElement>('button[data-category]')) {
    const selected = currentSelection.kind === 'category' && button.dataset.category === currentSelection.category
    button.setAttribute('aria-pressed', String(selected))
  }
}

function showRecipeSkeletons() {
  results.replaceChildren(...Array.from({ length: 6 }, () => {
    const card = document.createElement('div')
    card.className = 'recipe-skeleton'
    card.setAttribute('aria-hidden', 'true')
    card.innerHTML = '<div class="skeleton skeleton-photo"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div>'
    return card
  }))
}

async function loadRecipes(selection: Selection, scroll = false) {
  activeRequest?.abort()
  const request = new AbortController()
  activeRequest = request
  currentSelection = selection
  const timeout = window.setTimeout(() => request.abort(), 15_000)

  resultsTitle.textContent = selection.kind === 'search'
    ? `Recipes for “${selection.query}”`
    : selection.kind === 'category' ? `${selection.category} recipes` : 'What sounds good tonight?'
  resultsEyebrow.textContent = selection.kind === 'featured' ? 'A FRESH DOSE OF INSPIRATION' : 'LET’S FIND SOMETHING DELICIOUS'
  status.textContent = 'Finding a little inspiration…'
  resultCount.hidden = true
  resetButton.hidden = selection.kind === 'featured'
  retryButton.hidden = true
  feedback.hidden = true
  results.setAttribute('aria-busy', 'true')
  updateCategorySelection()
  showRecipeSkeletons()
  if (scroll) scrollToRecipes()

  try {
    let meals: Meal[]
    if (selection.kind === 'search') meals = await searchMeals(selection.query, request.signal)
    else if (selection.kind === 'category') meals = await getMealsByCategory(selection.category, request.signal)
    else meals = (await getFeaturedMeals(request.signal)).slice(0, 9)

    if (activeRequest !== request) return
    results.replaceChildren(...meals.map(createRecipeCard))
    resultCount.textContent = `${meals.length} recipe${meals.length === 1 ? '' : 's'}`
    resultCount.hidden = false
    status.textContent = meals.length
      ? selection.kind === 'featured' ? 'A few delicious ideas to get you started. Follow whichever catches your eye.' : `${meals.length} recipe${meals.length === 1 ? '' : 's'} found. A little closer to your next favourite.`
      : 'No recipes found. Try another name or explore a category.'

    if (!meals.length) {
      feedbackTitle.textContent = 'No matches this time.'
      feedbackCopy.textContent = 'Try a recipe name like “pasta” or “chicken”, or follow a different craving above.'
      feedback.hidden = false
    }
  } catch {
    if (activeRequest !== request) return
    results.replaceChildren()
    status.textContent = request.signal.aborted ? 'That took a little too long. Please try again.' : 'We couldn’t load the recipes. Check your connection and try again.'
    feedbackTitle.textContent = 'A little pause in the kitchen.'
    feedbackCopy.textContent = 'Your next favourite can wait a moment. Try loading these recipes again.'
    feedback.hidden = false
    retryButton.hidden = false
  } finally {
    window.clearTimeout(timeout)
    if (activeRequest === request) results.setAttribute('aria-busy', 'false')
  }
}

function renderCategories() {
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8)
  categoriesGrid.replaceChildren(...visibleCategories.map((category) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'category-tile'
    button.dataset.category = category.strCategory
    button.setAttribute('aria-pressed', 'false')

    const picture = document.createElement('span')
    picture.className = 'category-picture'
    picture.setAttribute('aria-hidden', 'true')
    picture.textContent = category.strCategory.slice(0, 1)
    if (category.strCategoryThumb) {
      const image = document.createElement('img')
      image.src = category.strCategoryThumb
      image.alt = ''
      image.loading = 'lazy'
      image.decoding = 'async'
      image.addEventListener('error', () => image.remove(), { once: true })
      picture.append(image)
    }

    const label = document.createElement('span')
    label.className = 'category-label'
    label.textContent = category.strCategory
    button.append(picture, label)
    return button
  }))
  categoriesToggle.hidden = categories.length <= 8
  categoriesToggle.textContent = showAllCategories ? 'Fewer categories −' : 'All categories +'
  categoriesToggle.setAttribute('aria-expanded', String(showAllCategories))
  updateCategorySelection()
}

async function loadCategories() {
  const request = new AbortController()
  const timeout = window.setTimeout(() => request.abort(), 15_000)
  categoriesGrid.setAttribute('aria-busy', 'true')
  categoriesStatus.textContent = 'Finding the flavours…'
  categoriesRetry.hidden = true
  categoriesToggle.hidden = true
  categoriesGrid.replaceChildren(...Array.from({ length: 8 }, () => {
    const skeleton = document.createElement('div')
    skeleton.className = 'category-skeleton skeleton'
    skeleton.setAttribute('aria-hidden', 'true')
    return skeleton
  }))
  try {
    categories = (await getCategories(request.signal)).sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.strCategory)
      const bIndex = categoryOrder.indexOf(b.strCategory)
      return (aIndex === -1 ? categoryOrder.length : aIndex) - (bIndex === -1 ? categoryOrder.length : bIndex)
    })
    if (!categories.length) throw new Error('No categories available')
    categoriesStatus.textContent = ''
    renderCategories()
  } catch {
    categoriesGrid.replaceChildren()
    categoriesStatus.textContent = 'Categories couldn’t load just now. You can still search for a recipe.'
    categoriesRetry.hidden = false
  } finally {
    window.clearTimeout(timeout)
    categoriesGrid.setAttribute('aria-busy', 'false')
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const query = input.value.trim()
  if (!query) {
    input.setCustomValidity('Enter a recipe name to search.')
    input.reportValidity()
    input.focus()
    return
  }
  input.setCustomValidity('')
  void loadRecipes({ kind: 'search', query }, true)
})
input.addEventListener('input', () => input.setCustomValidity(''))

document.querySelector('.quick-searches')!.addEventListener('click', (event) => {
  const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button[data-search]') : null
  if (!button?.dataset.search) return
  input.value = button.dataset.search
  input.setCustomValidity('')
  void loadRecipes({ kind: 'search', query: button.dataset.search }, true)
})

categoriesGrid.addEventListener('click', (event) => {
  const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button[data-category]') : null
  if (!button?.dataset.category) return
  input.value = ''
  input.setCustomValidity('')
  void loadRecipes({ kind: 'category', category: button.dataset.category }, true)
})

categoriesToggle.addEventListener('click', () => {
  showAllCategories = !showAllCategories
  renderCategories()
})
categoriesRetry.addEventListener('click', () => { void loadCategories() })
retryButton.addEventListener('click', () => { void loadRecipes(currentSelection) })
resetButton.addEventListener('click', () => {
  input.value = ''
  input.setCustomValidity('')
  void loadRecipes({ kind: 'featured' })
})
document.querySelector<HTMLAnchorElement>('.header-inner .brand')!.addEventListener('click', () => {
  if (currentSelection.kind !== 'featured') {
    input.value = ''
    input.setCustomValidity('')
    void loadRecipes({ kind: 'featured' })
  }
})
const heroPhoto = document.querySelector<HTMLImageElement>('.hero-photo')!
heroPhoto.addEventListener('error', () => {
  heroPhoto.hidden = true
  document.querySelector<HTMLElement>('.photo-fallback')!.hidden = false
}, { once: true })

void loadCategories()
void loadRecipes({ kind: 'featured' })
