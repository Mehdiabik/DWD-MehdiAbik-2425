/* 4 */

const form = document.querySelector('.friend-form');
const addfriend = form.querySelector('#button-primary');
const Name = form.querySelector('.name');
const Age = form.querySelector('.age');
const Email = form.querySelector('.email');
const Favoritecolor = form.querySelector('.color');
const Hobbies = form.querySelector('#checkbox-group');
const Errore = form.querySelector('.error-message');

/* 1 */

const DarkTheme = document.querySelector('.toggle-theme');

if (localStorage.darkMode === 'true') document.body.classList.add('dark-mode');

function Darkmode(e) {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    localStorage.darkMode = document.body.classList.contains('dark-mode');
}

DarkTheme.addEventListener('click', Darkmode());

/* 2 */

const OpenModal = document.querySelector('.open-modal');
const Modal = document.querySelectorAll('#modal hidden');
const close = Modal.querySelector('.close');

function ModalOpenen() {
    Modal.classList.remove('hidden');
    Modal.classList.add('show');
}

function closeModal() {
    Modal.classList.add('hidden');
    Modal.classList.remove('show');
}

OpenModal.addEventListener('click', ModalOpenen());
close.addEventListener('click', closeModal);

/* 3 */

const message = document.querySelector('.message');
const charcount = document.querySelector('.char-count');

for (let teller = message.length; teller < (2 * 100); teller++) {
    const count = (2 * 100) - teller;

    charcount.textContent = count + ' characters left';

    if (teller == (2 * 100)) {
        charcount.textContent = 'Veel te lang';
    }
}

function AddFriend(e) {
    e.preventDefault();
    if (Name == '') {
        Errore.textContent = 'je bent je naam of age vergeten';
    }
    else if (Age == '') {
        Errore.textContent = 'je bent je naam of age vergeten';
    }
    else if (Email == '') {
        Errore.textContent = 'je bent je email vergeten';
    }
    else if (!Email.includes('@')) {
        Errore.textContent = 'email moet @ bevatten';
    }
    else if (!Favoritecolor.value) {
        Errore.textContent = 'je hebt geen kleur gekozen';
    }
    else if (!Hobbies.value) {
        Errore.textContent = 'je hebt geen hobbie gekozen';
    }

    const newFriend = {
        Name: Name,
        Age: Age,
        Email: Email,
        Favoritecolor: Favoritecolor,
        Hobbies: Hobbies,
        Message: message
    };

    const friend = loadFromLocalStorage();

    friend.push(newFriend);
    saveToLocalStorage(friend);
}

const friendlist = document.querySelector('.friend-list');

function Show(Friend) {
    const Total = document.querySelector('.friend-count');
    friendlist.innerHTML = '';
    let count = 0;
    Friend.forEach((fr) => {
        const FriendHTML = `
            <div class="friend-entry"> 
                <p>${fr.Name}(${fr.Age})</p>
                <p>${fr.Email}</p>
                <p>${fr.Hobbies}</p>
                <p>${fr.message}</p>
            </div>
        `;

        friendlist.innerHTML += FriendHTML;
        count += Total;
        Total.innerHTML = count;
    });
}

document.addEventListener('', Show);

function loadFromLocalStorage() {
    // Leest de opgeslagen JSON-string uit localStorage
    const data = localStorage.getItem('AddFriend');

    // Als er data is, zet het terug om naar een array en geeft het terug
    if (data) {
        return JSON.parse(data);
    }

    // Als er geen data is (bijv. bij eerste bezoek), geeft een lege array terug
    return [];
}

function saveToLocalStorage(Friend) {
    // Zet de chatArray om naar een JSON-string en bewaart het onder de sleutel 'chatMessages'
    localStorage.setItem('AddFriend', JSON.stringify(Friend));
}

addfriend.addEventListener('click', AddFriend());

