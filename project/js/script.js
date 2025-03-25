// gravatar
const form = document.querySelector('#frmComment');
const Email = form.querySelector('#inpEmail');
const MsgEmail = form.querySelector('#msgEmail');
const MsgGravatar = form.querySelector('#msgGravatar');
const BtnGravatar = form.querySelector('#Gravatar');
const BtnFilter = form.querySelector('#filterFoto');

// informaties van de gebruiker laten zien 
async function handleGravatar(e) {
    e.preventDefault();
    MsgGravatar.innerHTML = '';

    // https://rogiervdl.github.io/JS-course/02_dom1.html
    // checken of alles ingevuld is
    if (Email.value == '') {
        MsgEmail.innerHTML = 'email mag niet leeg zijn';
    }

    // checken of het een @ bevat
    else if (!Email.value.includes('@')) {
        MsgEmail.innerHTML = 'email moet @ bevatten';
    }

    else {
        MsgEmail.innerHTML = '';
    }

    // build request
    /* global md5, sha256 */
    let email1;

    email1 = md5(Email.value.trim().toLowerCase());
    email1 = sha256(Email.value.trim().toLowerCase());

    const url = `https://gravatar.com/${email1}.json?foto=thumbnailUrl&Name=displayName&Location=currentLocation`;

    // fetch 
    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('opvragen informaties mislukt');
        return;
    }

    // fetch data
    const data = await resp.json();

    // array waar alle informaties in zitten
    const entry = data.entry[0];

    // informaties laten zien
    MsgGravatar.innerHTML = `<div>
    <p><img src='${entry.thumbnailUrl}' alt='Gravatar' style="width: 100px; height: 100px;"></p>
    </div>`;
}


// foto filter
async function handleFotoFilter(e) {
    e.preventDefault();
    MsgGravatar.innerHTML = '';

    let email1;
    email1 = md5(Email.value.trim().toLowerCase());
    email1 = sha256(Email.value.trim().toLowerCase());

    const url = `https://gravatar.com/${email1}.json?foto=thumbnailUrl&Name=displayName&Location=currentLocation`;

    // fetch 

    const resp = await fetch(url);
    if (!resp.ok) {
        console.log('opvragen informaties mislukt');
        return;
    }

    // fetch data
    const data = await resp.json();

    // array waar alle informaties in zitten
    const entry = data.entry[0];

    // informaties laten zien
    MsgGravatar.innerHTML = `<div>
   <img src='${entry.thumbnailUrl}' alt='Gravatar' class="sepia" style="width: 100px; height: 100px;">
    </div>`;
}

BtnGravatar.addEventListener('click', handleGravatar);
BtnFilter.addEventListener('click', handleFotoFilter);