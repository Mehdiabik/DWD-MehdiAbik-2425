/* ================================
   1) DOM DECLARATIES
   ================================ */
const form = document.querySelector('#search-form');
const queryInput = document.querySelector('#query');
const resultsList = document.querySelector('#results');
const searchBtn = form.querySelector('button[type="submit"]'); // "Zoeken"

/* ================================
   2) FUNCTIES
   ================================ */

// 2) TVMaze ophalen op basis van query, en JSON teruggeven
async function fetchShows(q) {
  const url = `https://api.tvmaze.com/search/shows?q=${q}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error('http-error');
  }
  return await resp.json(); // array met { score, show: {...} }
}

// 3) Resultaten naar HTML renderen
function renderResults(items) {
  // items is array van TVMaze "search" resultaten
   if (!items || items.length === 0) {
    resultsList.innerHTML = '<li>Geen resultaten gevonden.</li>';
    return;
  }

  // Bouw de lijst
  const html = items.map(function(entry) {
    const show = entry.show || {};
    const name = show.name || '—';
    const premiered = show.premiered || ''; // bv "1994-09-22"
    const year = premiered ? premiered.substring(0, 4) : '--';
    const img = show.image && (show.image.medium || show.image.original) ? (show.image.medium || show.image.original) : '';

    // Als geen afbeelding: toon een fallback-tekstje i.p.v. een broken image
    const imagePart = img
      ? `<img src="${img}" alt="${name}">`
      : '<div style="width:80px;height:60px;display:grid;place-items:center;background:#eee;color:#666;border-radius:4px;">geen&nbsp;afbeelding</div>';

    return `
      <li>
        ${imagePart}
        <div>
          <div><strong>${name}</strong></div>
          <div>Jaar: ${year}</div>
        </div>
      </li>
    `;
  }).join('');

  resultsList.innerHTML = html;
}

// 4) Fouthandeling + zoeken uitvoeren
async function handleSearch(e) {
  e.preventDefault(); // form-submit stoppen (ook bij click op button)
  const q = queryInput.value.trim();

  // leeg veld → leeg lijstje en stoppen
  if (!q) {
    resultsList.innerHTML = '';
    return;
  }

  // optioneel: kleine “loading”
  resultsList.innerHTML = '<li>Zoeken…</li>';

  try {
    const data = await fetchShows(q);

    // stap 2: ook in de console tonen
    console.log('TVMaze resultaten voor "' + q + '":', data);

    // stap 3: renderen
    renderResults(data);
  } catch (err) {
    // stap 4: netwerkfout
    resultsList.innerHTML = '<li>Netwerkfout. Probeer later opnieuw.</li>';
  }
}

/* ================================
   3) EVENTS
   ================================ */

searchBtn.addEventListener('click', handleSearch);
form.addEventListener('submit', handleSearch);
