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
const MsgGravatar = form.querySelector('#msgGravatar');
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

let currentGifIndex = 0;
let gifResults = [];
let activeTextElement = null;

// Bericht toevoegen + gravatar ophalen
function handleGravatar(e) {
    e.preventDefault();
    MsgGravatar.innerHTML = '';

    const email = Email.value.trim().toLowerCase();
    const comment = commentInput.value.trim();
    let geldig = true;

    // Validatie email
    if (email === '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn';
        geldig = false;
    } else if (!email.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten';
        geldig = false;
    } else {
        MsgEmail.innerHTML = '';
    }

    // Validatie comment
    if (comment === '') {
        msgComment.innerText = 'comment mag niet leeg zijn';
        geldig = false;
    } else {
        msgComment.innerText = '';
    }

    if (!geldig) return;

    // MD5 hash van het e-mailadres met CryptoJS
    const emailHash = md5(email).toString();

    // Avatar URL via Gravatar (zonder JSON/fetch)
    const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

    // Naam = gewoon het e-mailadres
    const displayName = email;

    // Nieuw bericht object
    const nieuwBericht = {
        name: displayName,
        avatar: gravatarUrl,
        text: comment
    };

    // Opslaan in localStorage en tonen
    const geschiedenis = loadFromLocalStorage();
    geschiedenis.push(nieuwBericht);
    saveToLocalStorage(geschiedenis);
    renderChat(geschiedenis);

    // Reset form + onthoud email
    commentInput.value = '';
    localStorage.setItem('savedEmail', email);
}


// Gravatar foto filter (extra - sepia stijl)
function handleFotoFilter(e) {
    e.preventDefault();
    MsgGravatar.innerHTML = '';
    const comment = commentInput.value.trim();
    const email = Email.value.trim().toLowerCase();
    let geldig = true;

    // Validatie email

    if (email === '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn';
        geldig = false;
    } else if (!email.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten';
        geldig = false;
    } else {
        MsgEmail.innerHTML = '';
    }

    // Validatie comment
    if (comment === '') {
        msgComment.innerText = 'comment mag niet leeg zijn';
        geldig = false;
    } else {
        msgComment.innerText = '';
    }
    if (!geldig) return;

    const emailHash = md5(email).toString();
    const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;

    const newMessage = {
        name: email,
        avatar: avatarUrl, // avatar in de chatbubble
        text: comment + `<img src="${avatarUrl}" class="sepia" style="width:100px; height:100px;">`
    };

    const geschiedenis = loadFromLocalStorage();
    geschiedenis.push(newMessage);
    saveToLocalStorage(geschiedenis);
    renderChat(geschiedenis);
}


// Opslaan & laden uit localStorage
function saveToLocalStorage(chatArray) {
    localStorage.setItem('chatMessages', JSON.stringify(chatArray));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('chatMessages');
    return data ? JSON.parse(data) : [];
}

// Chatberichten tonen in HTML
function renderChat(chatArray) {
    chatBox.innerHTML = '';
    chatArray.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.title = msg.name;

        const avatarImg = document.createElement('img');
        avatarImg.src = msg.avatar;
        avatarImg.alt = 'Gravatar';
        avatarImg.className = 'avatar';

        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.innerHTML = msg.text;

        // Voeg GIFs toe als ze er zijn
        if (msg.images) {
            msg.images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.style.marginTop = '10px';
                img.style.maxWidth = '100%';
                textDiv.appendChild(img);
            });
        }

        // Dubbelklik event toevoegen
        textDiv.addEventListener('dblclick', () => {
            const woorden = msg.text.split(' ');
            const zoekterm = woorden[0]; // of zelf kiezen welke
            openGifModal(zoekterm, textDiv);
        });

        messageDiv.appendChild(avatarImg);
        messageDiv.appendChild(textDiv);
        chatBox.appendChild(messageDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Open modal met gifs op basis van zoekterm
async function openGifModal(keyword, targetTextElement) {
    activeTextElement = targetTextElement;
    gifTitle.textContent = `You searched for: '${keyword}' !`;
    gifGallery.innerHTML = 'GIFs laden...';

    const apiKey = 'BE7EGnnCuQlhDSOBVuJhS4114y0xh5yK';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(keyword)}&limit=10&rating=g`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        gifResults = data.data;

        if (gifResults.length === 0) {
            gifGallery.innerHTML = 'Geen gifs gevonden.';
            return;
        }

        currentGifIndex = 0;
        renderGif();
        modal.style.display = 'block';
    } catch (err) {
        gifGallery.innerHTML = 'Er ging iets mis bij het laden van GIFs.';
    }
}

// Toon de geselecteerde GIF in de galerij
function renderGif() {
    gifGallery.innerHTML = '';
    const gif = gifResults[currentGifIndex];
    const img = document.createElement('img');
    img.src = gif.images.fixed_height.url;
    img.alt = gif.title;
    gifGallery.appendChild(img);
}

// Sluit modal
function closeGifModal() {
    modal.style.display = 'none';
    gifGallery.innerHTML = '';
    gifResults = [];
    currentGifIndex = 0;
}

// Voeg de gekozen gif toe aan de chat
function selectGif() {
    if (!activeTextElement) return;
    const gif = gifResults[currentGifIndex];
    const img = document.createElement('img');
    img.src = gif.images.fixed_height.url;
    img.alt = 'GIF';
    img.style.marginTop = '10px';
    img.style.maxWidth = '100%';
    activeTextElement.appendChild(img);

    saveChatBoxToLocalStorage();
    closeGifModal();
}

// Navigatieknoppen
btnPrev.addEventListener('click', () => {
    if (gifResults.length > 0) {
        currentGifIndex = (currentGifIndex - 1 + gifResults.length) % gifResults.length;
        renderGif();
    }
});

btnNext.addEventListener('click', () => {
    if (gifResults.length > 0) {
        currentGifIndex = (currentGifIndex + 1) % gifResults.length;
        renderGif();
    }
});

btnSelect.addEventListener('click', selectGif);
closeModal.addEventListener('click', closeGifModal);
window.addEventListener('click', e => {
    if (e.target === modal) closeGifModal();
});

// Bewaar chat inclusief gifs
function saveChatBoxToLocalStorage() {
    const messages = [...chatBox.querySelectorAll('.message')].map(msg => {
        const name = msg.getAttribute('title');
        const avatar = msg.querySelector('img.avatar').src;
        const textBlock = msg.querySelector('.text');
        const text = textBlock.childNodes[0]?.textContent || '';
        const images = [...textBlock.querySelectorAll('img')].map(img => img.src);
        return { name, avatar, text, images };
    });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

// Event listeners
BtnGravatar.addEventListener('click', handleGravatar);
BtnFilter.addEventListener('click', handleFotoFilter);

// Chat laden bij opstart
const chatHistory = loadFromLocalStorage();
renderChat(chatHistory);

const savedEmail = localStorage.getItem('savedEmail');
if (savedEmail) {
    Email.value = savedEmail;
}
