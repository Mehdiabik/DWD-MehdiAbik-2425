const btn = document.querySelector('#btnGo');
const searchInput = document.querySelector('#inpSearch');
const select = document.querySelector('#selCats');
const quoteSpan = document.querySelector('.sidekick span');
const msgCats = document.querySelector('#msgCats');

async function fetchCategories() {
    const cached = localStorage.getItem('chuckCategories');
    if (cached) {
        return JSON.parse(cached);
    }

    const resp = await fetch('https://api.chucknorris.io/jokes/categories');
    const categories = await resp.json();

    localStorage.setItem('chuckCategories', JSON.stringify(categories));
    return categories;
}

function fillCategoryDropdown(categories) {
    let optionsHTML = '<option value="">Kies een categorie</option>';
    categories.forEach(category => {
        optionsHTML += `<option value="${category}">${category}</option>`;
    });
    select.innerHTML = optionsHTML;
}

async function fetchRandomQuote(category) {
    if (!category) return;
    try {
        const resp = await fetch(`https://api.chucknorris.io/jokes/random?category=${category}`);
        const data = await resp.json();
        quoteSpan.textContent = data.value;
    } catch (err) {
        quoteSpan.textContent = 'Fout bij het ophalen van de quote.';
        console.error(err);
    }
}

async function searchQuote(keyword) {
    if (!keyword) return;
    try {
        const resp = await fetch(`https://api.chucknorris.io/jokes/search?query=${keyword}`);
        const data = await resp.json();

        const output = data.result.length > 0
            ? data.result[Math.floor(Math.random() * data.result.length)].value
            : 'Geen resultaten gevonden.';

        quoteSpan.textContent = output;
    } catch (err) {
        quoteSpan.textContent = 'Fout bij het zoeken naar quotes.';
        console.error(err);
    }
}

function setUpEventHandlers() {
    btn.addEventListener('click', function() {
        searchQuote(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchQuote(searchInput.value);
        }
    });

    select.addEventListener('change', function() {
        fetchRandomQuote(select.value);
    });
}


async function startApp() {
   try {
       const categories = await fetchCategories();
       fillCategoryDropdown(categories);
       msgCats.textContent = '';
   } catch (err) {
       msgCats.textContent = 'Categorieën laden mislukt.';
       console.error(err);
   }

   setUpEventHandlers();
}

startApp();
