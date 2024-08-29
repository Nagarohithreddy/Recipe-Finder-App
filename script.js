document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const searchResultDiv = document.querySelector('.search-result');
  const container = document.querySelector('.container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const pageDisplay = document.getElementById('page-display');

  let searchQuery = '';
  let currentPage = 1;
  const resultsPerPage = 12; // Number of results per page
  let totalResults = 0; // Will be set based on API response
  const APP_ID = "76b313ac";
  const APP_KEY = "11a26e30349ff4cc8cb24041f1417c20";

  // Event listener for search button
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchQuery = searchInput.value.trim();
    if (searchQuery) {
      currentPage = 1; // Reset to first page on new search
      fetchAPI();
    } else {
      alert('Please enter a search term.');
    }
  });

  // Event listeners for pagination buttons
  prevBtn.addEventListener('click', () => changePage(-1));
  nextBtn.addEventListener('click', () => changePage(1));

  function changePage(delta) {
    currentPage += delta;
    fetchAPI(); // Fetch new results based on the updated page
    updateButtons();
    updatePageDisplay();
    scrollToTop(); // Scroll to the top after page change
  }

  function updateButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * resultsPerPage >= totalResults;
  }

  function updatePageDisplay() {
    pageDisplay.textContent = `Page ${currentPage}`;
  }

  async function fetchAPI() {
    const from = (currentPage - 1) * resultsPerPage;
    const to = from + resultsPerPage;
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${from}&to=${to}`;
    try {
      const response = await fetch(baseURL);
      const data = await response.json();
      totalResults = data.count; // Set the total number of results
      generateHTML(data.hits);
      updateButtons();
      updatePageDisplay();
    } catch (error) {
      console.error('Error fetching data:', error);
      searchResultDiv.innerHTML = '<p class="error-message">An error occurred. Please try again later.</p>';
    }
  }

  function generateHTML(results) {
    container.classList.remove('initial');
    let generatedHTML = '';
    results.map(result => {
      generatedHTML += `
        <div class="item">
          <img src="${result.recipe.image}" alt="${result.recipe.label}">
          <div class="flex-container">
            <h1 class="title">${result.recipe.label}</h1>
            <a class="view-btn" target="_blank" href="${result.recipe.url}">View Recipe</a>
          </div>
          <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
          <p class="item-data">Diet label: ${result.recipe.dietLabels.length > 0 ? result.recipe.dietLabels.join(', ') : 'No Data Found'}</p>
          <p class="item-data">Health labels: ${result.recipe.healthLabels.length > 0 ? result.recipe.healthLabels.join(', ') : 'No Data Found'}</p>
        </div>
      `;
    });
    searchResultDiv.innerHTML = generatedHTML;
  }

  // Function to scroll to the top of the results
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
});

