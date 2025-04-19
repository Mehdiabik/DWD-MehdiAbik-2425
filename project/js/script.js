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

let currentGifIndex = 0;
let gifResults = [];
let activeTextElement = null;

function generateMD5(email) {
    return md5(email.trim().toLowerCase()).toString();
}

// Gravatar profiel ophalen via fetch
async function fetchGravatarProfile(email) {
    const emailHash = generateMD5(email);
    const url = `https://www.gravatar.com/${emailHash}.json`;

    try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        return {
            displayName: data.entry[0].displayName || email,
            avatar: data.entry[0].thumbnailUrl || `https://www.gravatar.com/avatar/${emailHash}?d=mp`
        };
    } catch {
        return null;
    }
}

// Bericht toevoegen + gravatar ophalen
async function handleGravatar(e) {
    e.preventDefault();

    const email = Email.value.trim().toLowerCase();
    const comment = commentInput.value.trim();
    let geldig = true;

    if (email === '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn';
        geldig = false;
    } else if (!email.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten';
        geldig = false;
    } else {
        MsgEmail.innerHTML = '';
    }

    if (comment === '') {
        msgComment.innerText = 'comment mag niet leeg zijn';
        geldig = false;
    } else {
        msgComment.innerText = '';
    }

    if (!geldig) return;

    const profile = await fetchGravatarProfile(email);
    const avatarUrl = profile?.avatar || `https://www.gravatar.com/avatar/${generateMD5(email)}?d=mp`;
    const displayName = profile?.displayName || email;

    const nieuwBericht = {
        name: displayName,
        avatar: avatarUrl,
        text: comment
    };

    const geschiedenis = loadFromLocalStorage();
    geschiedenis.push(nieuwBericht);
    saveToLocalStorage(geschiedenis);
    await renderChat(geschiedenis);

    commentInput.value = '';
    localStorage.setItem('savedEmail', email);
}

// Gravatar foto filter (sepia)
async function handleFotoFilter(e) {
    e.preventDefault();

    const comment = commentInput.value.trim();
    const email = Email.value.trim().toLowerCase();
    let geldig = true;

    if (email === '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn';
        geldig = false;
    } else if (!email.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten';
        geldig = false;
    } else {
        MsgEmail.innerHTML = '';
    }

    if (comment === '') {
        msgComment.innerText = 'comment mag niet leeg zijn';
        geldig = false;
    } else {
        msgComment.innerText = '';
    }

    if (!geldig) return;

    const profile = await fetchGravatarProfile(email);
    const avatarUrl = profile?.avatar || `https://www.gravatar.com/avatar/${generateMD5(email)}?d=mp`;

    const newMessage = {
        name: email,
        avatar: avatarUrl,
        text: `<p>${comment}</p><img src="${avatarUrl}" class="sepia" alt="Gravatar" style="width:100px; height:100px;">`
    };

    const geschiedenis = loadFromLocalStorage();
    geschiedenis.push(newMessage);
    saveToLocalStorage(geschiedenis);
    await renderChat(geschiedenis);
}

// Chatberichten tonen in HTML (met innerHTML en fetch ondersteuning)
function renderChat(chatArray) {
    chatBox.innerHTML = ''; // wis bestaande berichten

    for (const msg of chatArray) {
        // HTML string voor GIFs toevoegen
        let gifHTML = '';
        if (Array.isArray(msg.images)) {
            for (const src of msg.images) {
                gifHTML += `<img src="${src}" alt="GIF" style="margin-top:10px; max-width:100%">`;
            }
        }

        const messageHTML = `
            <div class="message" title="${msg.name}">
                <img src="${msg.avatar}" alt="Gravatar" class="avatar">
                <div class="text">${msg.text}${gifHTML}</div>
            </div>
        `;

        chatBox.innerHTML += messageHTML;
    }

    const textDivs = chatBox.querySelectorAll('.text');
    for (const textDiv of textDivs) {
        textDiv.addEventListener('dblclick', () => {
            const woorden = textDiv.textContent.trim().split(' ');
            const zoekterm = woorden[0] || 'funny';
            openGifModal(zoekterm, textDiv);
        });
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Opslaan & laden uit localStorage
function saveToLocalStorage(chatArray) {
    localStorage.setItem('chatMessages', JSON.stringify(chatArray));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('chatMessages');
    if (data) {
        return JSON.parse(data);
    } 
    return [];
}

// Open modal met gifs op basis van zoekterm
async function openGifModal(keyword, targetTextElement) {
    activeTextElement = targetTextElement;
    gifTitle.textContent = `You searched for: '${keyword}' !`;
    gifGallery.innerHTML = 'GIFs laden...';

    const apiKey = 'BE7EGnnCuQlhDSOBVuJhS4114y0xh5yK';
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword}&limit=10&rating=g`;

    const resp = await fetch(url);
    const data = await resp.json();
    gifResults = data.data;

    if (gifResults.length === 0) {
        gifGallery.innerHTML = 'Geen gifs gevonden.';
    } else {
        currentGifIndex = 0;
        renderGif();
        modal.classList.add('show'); // ✅ class toevoegen i.p.v. .style.display
    }
}

function renderGif() {
    gifGallery.innerHTML = '';
    const gif = gifResults[currentGifIndex];
    gifGallery.innerHTML = `<img src="${gif.images.fixed_height.url}" alt="${gif.title}" style="max-width:100%; height:auto;">`;
}

function closeGifModal() {
    modal.classList.remove('show'); // ✅ class verwijderen i.p.v. .style.display
    gifGallery.innerHTML = '';
    gifResults = [];
    currentGifIndex = 0;
}

function selectGif() {
    if (!activeTextElement) return;

    const gif = gifResults[currentGifIndex];
    const imgHTML = `<img src="${gif.images.fixed_height.url}" alt="GIF" style="margin-top:10px; max-width:100%;">`;
    activeTextElement.innerHTML += imgHTML;

    saveChatBoxToLocalStorage();
    closeGifModal();
}

// Event handlers
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
    if (e.target === modal) {
        closeGifModal();
    }
});


function saveChatBoxToLocalStorage() {
    const messageElements = chatBox.querySelectorAll('.message');
    const messages = [];
    
    messageElements.forEach(msg => {
        const name = msg.getAttribute('title');
        const avatar = msg.querySelector('img.avatar').src;
        const textBlock = msg.querySelector('.text');
        const text = textBlock.innerHTML;
    
        const images = [];
        const imageElements = textBlock.querySelectorAll('img');
        imageElements.forEach(img => {
            images.push(img.src);
        });
    
        messages.push({
            name: name,
            avatar: avatar,
            text: text,
            images: images
        });
    });
    
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

BtnGravatar.addEventListener('click', handleGravatar);
BtnFilter.addEventListener('click', handleFotoFilter);

const chatHistory = loadFromLocalStorage();
renderChat(chatHistory);

const savedEmail = localStorage.getItem('savedEmail');
if (savedEmail) {
    Email.value = savedEmail;
}