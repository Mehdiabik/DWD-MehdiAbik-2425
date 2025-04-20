/* eslint-disable no-unused-vars */
// MD5 hash en fallback avatar
// build request
/* global md5, */

// Chatbox
const chatBox = document.querySelector('#chat-box');
const commentInput = document.querySelector('#typingplaats');
const msgComment = document.querySelector('#msgComment');

// Gravatar formulier
const form = document.querySelector('#frmComment');
const Email = form.querySelector('#inpEmail');
const MsgEmail = form.querySelector('#msgEmail');
const BtnGravatar = form.querySelector('#Gravatar');
const BtnFilter = form.querySelector('#filterFoto');

// Gyphy Modal
const modal = document.querySelector('#gif-modal');
const closeModal = modal.querySelector('.close');
const gifGallery = document.querySelector('#gif-gallery');
const btnPrev = document.querySelector('#btn-prev');
const btnNext = document.querySelector('#btn-next');
const btnSelect = document.querySelector('#btn-select');
const gifTitle = document.querySelector('#gif-search-title');

let Gifindex = 0;
let gifResults = [];
let activeTextElement = null;

// Functie om een MD5-hash te genereren op basis van een e-mailadres
function generateMD5(email) {
    //  Verwijder spaties aan begin en einde van het e-mailadres
    //  Zet het e-mailadres om naar kleine letters (MD5 is hoofdlettergevoelig)
    //  Zet de hash om naar een string (indien niet al een string)
    return md5(email.trim().toLowerCase()).toString();
}

// Async functie om het Gravatar-profiel op te halen op basis van een e-mailadres
async function fetchGravatarProfile(email) {
    // Genereer een MD5-hash van het e-mailadres 
    const emailHash = generateMD5(email);

    // Bouw de URL om het profiel op te halen via Gravatar's JSON endpoint
    // Normaal gezien zijn de paramters foto en Name overbodig maar zonder dit werkte het niet wegens CORS regels en ik weet ook niet waarom
    const url = `https://gravatar.com/${emailHash}.json?foto=thumbnailUrl&Name=displayName`;

    try {
        // Verstuur een GET-verzoek naar de Gravatar API
        const response = await fetch(url);

        // Als de response niet ok is bv geen publiek profiel geeft hij null terug
        if (!response.ok) {
            // Als de status bijvoorbeeld 404 is, return fallback
            throw new Error('Geen publiek profiel');
        }

        // Zet de response om naar JSON 
        const data = await response.json();

        // Haal het eerste profielobject uit de 'entry' array
        const entry = data.entry[0];

        // Geef een object terug met de displayName en de thumbnail URL dus de foto van de gebruiker
        return {
            displayName: entry.displayName,
            avatar: entry.thumbnailUrl
        };
    } catch (err) {
        // als er geen profiel beschikbaar is toon ik een standaard foto
        return {
            displayName: 'onbekend',
            avatar: 'img/1.jpg' 
          };          
    }
}

// Bericht toevoegen + gravatar ophalen
async function handleGravatar(e) {
    e.preventDefault();

    const email = Email.value.trim().toLowerCase(); // Haal e-mail op en normaliseer (kleine letters + trim)
    const comment = commentInput.value.trim(); // Haal comment op en verwijder spaties voor/achter
    let geldig = true; // Boolean voor validatiecontrole

    // Controleer of e-mail leeg is
    if (email === '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn';
        geldig = false;

        // Controleer of e-mail een @ bevat
    } else if (!email.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten';
        geldig = false;
    } else {
        MsgEmail.innerHTML = ''; // Wis foutmelding als e-mail ok is
    }

    // Controleer of comment leeg is
    if (comment === '') {
        msgComment.innerText = 'comment mag niet leeg zijn';
        geldig = false;
    } else {
        msgComment.innerText = ''; // Wis foutmelding als comment ok is
    }

    // Stop functie als e-mail of comment niet geldig zijn
    if (!geldig) return;

    // Haal gravatar profiel op via fetch functie
    const profile = await fetchGravatarProfile(email);

    // Haal de avatar URL(foto) en weergavenaam uit het profiel
    const avatarUrl = profile.avatar;
    const displayName = profile.displayName;

    // Maak een nieuw berichtobject aan
    const nieuwBericht = {
        name: displayName, // Naam van gebruiker 
        avatar: avatarUrl, // Profielfoto
        text: comment // Berichtinhoud
    };

    // Haal bestaande berichten op uit localStorage
    const geschiedenis = loadFromLocalStorage();

    // Voeg nieuw bericht toe aan het einde
    geschiedenis.push(nieuwBericht);

    // Sla de nieuwe berichtenlijst op in localStorage
    saveToLocalStorage(geschiedenis);

    // Herteken de chat met alle berichten
    await renderChat(geschiedenis);

    // Wis het tekstveld
    commentInput.value = '';

    // Onthoud e-mailadres in localStorage zodat gebruiker dit niet opnieuw hoeft in te vullen
    localStorage.setItem('savedEmail', email);
}

// Toont chatberichten op het scherm, en koppelt events voor GIF en verwijderen
function renderChat(chatArray) {
    chatBox.innerHTML = ''; // Leegt eerst de chatbox (anders worden berichten verdubbeld)

    // Loopt door elk bericht in de array en voeg HTML toe
    chatArray.forEach((msg, index) => {
        const messageHTML = `
            <div class="message" title="${msg.name}" data-index="${index}"> 
                <img src="${msg.avatar}" alt="Gravatar" class="avatar"> 
                <div class="text">${msg.text}</div> 
                <span class="remove" title="Verwijder bericht">✖</span> 
            </div>
        `;

        chatBox.innerHTML += messageHTML; // Voegt het bericht toe aan de chatbox
    });

    // ____________________________________________________
    // UITBREIDING

    // Zoekt alle verwijderknoppen en koppel een klik-event
    const removeButtons = chatBox.querySelectorAll('.remove');
    removeButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const messageDiv = e.target.closest('.message'); // Vindt de bijhorende message container
            const index = Number(messageDiv.dataset.index); // Haalt index uit data-attribuut
            chatArray.splice(index, 1); // Verwijdert bericht uit de array
            saveToLocalStorage(chatArray); // Slaat aangepaste array op
            renderChat(chatArray); // Hertekent de chat met bijgewerkte array
        });
    });

    // _____________________________________________________
    // Koppelt dubbelklik-events aan de tekst om GIFs te zoeken
    const textDivs = chatBox.querySelectorAll('.text');
    textDivs.forEach(textDiv => {
        textDiv.addEventListener('dblclick', () => {
            const woorden = textDiv.textContent.trim().split(' '); // Splitst tekst in woorden
            const zoekterm = woorden[0] || 'funny'; // Gebruikt eerste woord als zoekterm (of 'funny' als fallback)
            openGifModal(zoekterm, textDiv); // Opent GIF-modal met zoekterm
        });
    });

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll automatisch naar beneden zodat laatste bericht zichtbaar is
}

// Slaat de chatgeschiedenis op in localStorage
function saveToLocalStorage(chatArray) {
    // Zet de chatArray om naar een JSON-string en bewaart het onder de sleutel 'chatMessages'
    localStorage.setItem('chatMessages', JSON.stringify(chatArray));
}

// Haalt de chatgeschiedenis op uit localStorage
function loadFromLocalStorage() {
    // Leest de opgeslagen JSON-string uit localStorage
    const data = localStorage.getItem('chatMessages');

    // Als er data is, zet het terug om naar een array en geeft het terug
    if (data) {
        return JSON.parse(data);
    }

    // Als er geen data is (bijv. bij eerste bezoek), geeft een lege array terug
    return [];
}

// Open modal met gifs op basis van zoekterm
async function openGifModal(keyword, huidigTekstElement) {
    // Onthoud op welk chatelement de gebruiker dubbelklik heeft gedaan
    activeTextElement = huidigTekstElement;

    // Toon titel van zoekopdracht in de modal
    gifTitle.textContent = `You searched for: '${keyword}' !`;

    // Geef aan dat GIFs aan het laden zijn
    gifGallery.innerHTML = 'GIFs laden...';

    // API sleutel en endpoint opbouwen
    const apiKey = 'BE7EGnnCuQlhDSOBVuJhS4114y0xh5yK';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword}&limit=10&rating=g`;

    // Ophalen van GIF resultaten via fetch
    const resp = await fetch(url);
    const data = await resp.json();
    gifResults = data.data; // Resultaten opslaan

    // Als er geen resultaten zijn, toon boodschap
    if (gifResults.length === 0) {
        gifGallery.innerHTML = 'Geen gifs gevonden.';
    } else {
        // Startindex instellen en eerste gif tonen
        Gifindex = 0;
        renderGif(); // Toont de eerste gif
        modal.classList.add('show'); // Toon de modal
    }
}

// Toont de geselecteerde gif in de modal
function renderGif() {
    gifGallery.innerHTML = ''; // Reset inhoud
    const gif = gifResults[Gifindex]; // haalt huidige gif op
    gifGallery.innerHTML = `<img src="${gif.images.fixed_height.url}" alt="${gif.title}" style="max-width:100%; height:auto;">`;
}

// Sluit de gif-modal en reset gegevens
function closeGifModal() {
    modal.classList.remove('show'); // Verbergt de modal
    gifGallery.innerHTML = ''; // Wist inhoud
    gifResults = []; // Reset resultaten
    Gifindex = 0; // Reset index
}

// Wanneer gebruiker op "SELECT" klikt, voegt de gif toe als apart bericht
function selectGif() {
    const gif = gifResults[Gifindex]; // haalt huidige gif op
    const gifUrl = gif.images.fixed_height.url;

    // Haalt gebruiker email en avatar op
    const email = Email.value.trim().toLowerCase();
    const emailHash = md5(email); // Avatar genereren via MD5
    const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

    // Nieuw chatbericht object met gif
    const gifMessage = {
        name: email,
        avatar: avatarUrl,
        text: `<img src="${gifUrl}" alt="GIF" style="margin-top:10px; max-width:100%;">`,
        images: [gifUrl]
    };

    // Voegt toe aan geschiedenis en toont in chat
    const geschiedenis = loadFromLocalStorage();
    geschiedenis.push(gifMessage);
    saveToLocalStorage(geschiedenis);
    renderChat(geschiedenis);

    // Sluit de modal na selectie
    closeGifModal();
}

// _____________________________________________________________________________________________________ 
// UITBREIDING

// Gravatar foto filter (sepia)
async function handleFotoFilter(e) {
    e.preventDefault();

    const comment = commentInput.value.trim(); // Haal de comment op en verwijder spaties
    const email = Email.value.trim().toLowerCase(); // Haal e-mailadres op en normaliseer
    let geldig = true; // Begin met geldige invoer

    // Validatie van het e-mailadres
    if (email === '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn'; // Toon fout als e-mail leeg is
        geldig = false;
    } else if (!email.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten'; // Toon fout als @ ontbreekt
        geldig = false;
    } else {
        MsgEmail.innerHTML = ''; // Wis foutmelding als email ok is
    }

    // Validatie van het commentaarveld
    if (comment === '') {
        msgComment.innerText = 'comment mag niet leeg zijn'; // Toon fout als comment leeg is
        geldig = false;
    } else {
        msgComment.innerText = ''; // Wis foutmelding als comment ok is
    }

    // Stop functie als er iets fout is
    if (!geldig) return;

    // Haal gravatar profiel op met fetch
    const profile = await fetchGravatarProfile(email);
    const avatarUrl = profile.avatar; // Haal avatar link uit profiel

    // Bouw het nieuwe berichtobject
    const newMessage = {
        name: email, // Gebruik e-mailadres als naam
        avatar: avatarUrl, // Standaard of echte gravatar URL
        text: `<p>${comment}</p><img src="${avatarUrl}" class="sepia" alt="Gravatar" style="width:100px; height:100px;">`// Voeg sepia-gefilterde avatar toe aan het bericht
    };

    commentInput.value = ''; // Wis het commentaarveld

    // Voeg het bericht toe aan de chatgeschiedenis
    const geschiedenis = loadFromLocalStorage();
    geschiedenis.push(newMessage); // Voeg bericht toe
    saveToLocalStorage(geschiedenis); // Sla nieuwe lijst op
    await renderChat(geschiedenis); // Toon de geüpdatete chat
}

// Selecteert de emoji-balk waar de emoji's staan
const emojiBar = document.querySelector('#emoji-bar');

// Selecteert alle <span>-elementen binnen de emoji-balk 
const emojiButtons = emojiBar.querySelectorAll('span');

// Voor elke emoji (span) wordt een klik-eventlistener toegevoegd
emojiButtons.forEach(emoji => {
    emoji.addEventListener('click', () => {
        // Voeg de aangeklikte emoji toe aan het tekstveld voor het commentaar
        commentInput.value += emoji.textContent;

        // Zorg ervoor dat het tekstveld actief blijft na het klikken
        commentInput.focus();
    });
});


// 🌙 Donkere modus
const toggleBtn = document.querySelector('#toggle-darkmode');

// Zet opgeslagen modus bij het laden
if (localStorage.darkMode === 'true') document.body.classList.add('dark-mode');

// Toggle modus bij klik
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.darkMode = document.body.classList.contains('dark-mode');
});

// ______________________________________________________________________________________________________


// Event handler voor de "Vorige"-knop in de GIF-modal
btnPrev.addEventListener('click', () => {
    // Alleen uitvoeren als er daadwerkelijk resultaten zijn
    if (gifResults.length > 0) {
        // Ga naar de vorige GIF (met wrap-around)
        Gifindex = (Gifindex - 1 + gifResults.length) % gifResults.length;
        renderGif(); // Toon de geselecteerde GIF
    }
});

// Event handler voor de "Volgende"-knop in de GIF-modal
btnNext.addEventListener('click', () => {
    // Alleen uitgevoerd als er daadwerkelijk resultaten zijn
    if (gifResults.length > 0) {
        // Gaat naar de volgende GIF (met wrap-around)
        Gifindex = (Gifindex + 1) % gifResults.length;
        renderGif(); // Toon de geselecteerde GIF
    }
});

// Event handler voor de "Selecteer"-knop om een GIF toe te voegen
btnSelect.addEventListener('click', selectGif);

// Event handler om de modal te sluiten via de sluitknop (✖)
closeModal.addEventListener('click', closeGifModal);

// Sluit modal als je buiten de modal klikt (op de achtergrond)
window.addEventListener('click', e => {
    if (e.target === modal) {
        closeGifModal();
    }
});

// Event handler voor de knop "ADD COMMENT" (comment + Gravatar ophalen)
BtnGravatar.addEventListener('click', handleGravatar);

// Event handler voor de knop "FILTER FOTO" (Gravatar met sepia filter)
BtnFilter.addEventListener('click', handleFotoFilter);

// Bij het herladen van de pagina: laad de chatgeschiedenis uit localStorage
const chatHistory = loadFromLocalStorage();
renderChat(chatHistory); // Toon die in de chatbox

// Herstel het laatst gebruikte e-mailadres als dat nog opgeslagen is
const savedEmail = localStorage.getItem('savedEmail');
if (savedEmail) {
    Email.value = savedEmail;
}
