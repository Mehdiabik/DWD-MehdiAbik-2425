const select = document.querySelector('.category-select');
const question = document.querySelector('.question');
const btn = document.querySelector('.fetch-question');
const difficult = document.querySelector('.category-select');

async function fetchCategories() {
    const cached = localStorage.getItem('Categories');
    if (cached) {
        return JSON.parse(cached);
    }

    const url = 'https://opentdb.com/api_category.php';

    const resp = await fetch(url);
    const categories = await resp.json();

    localStorage.setItem('Categories', JSON.stringify(categories));
    return categories;
}

function CategoriesKiezen(categories) {
    let optionsHTML = '<option value="">Kies een categorie</option>';
    categories.forEach(category => {
        optionsHTML += `<option value="${category}">${category}</option>`;
    });
    select.innerHTML = optionsHTML;
}

async function fetchRandomQuestion(category, difficulty) {
    if (!category) return;
    try {
        const resp = await fetch(`https://opentdb.com/api.php?amount=1&category${category}difficulty=${difficulty}&type=boolean`);
        const data = await resp.json();
        question.textContent = data.value;
    } catch (err) {
        question.textContent = 'Fout bij het ophalen';
        console.error(err);
    }
}

function setUpEventHandlers() {
     btn.addEventListener('click', function() {
        fetchRandomQuestion(select.value, difficult.value);
    });

    difficult.addEventListener('change', function() {
        fetchRandomQuestion(difficult.value);
    });

    select.addEventListener('change', function() {
        fetchRandomQuestion(select.value);
    });
}

async function startApp() {
   try {
       const categories = await fetchCategories();
       CategoriesKiezen(categories);
       question.textContent = '';
   } catch (err) {
       console.error(err);
   }

   setUpEventHandlers();
}

startApp();