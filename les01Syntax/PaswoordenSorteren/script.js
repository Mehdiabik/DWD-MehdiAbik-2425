function IsCorrectPassword(pw) {
    if (pw.length > 9) return false;
    if (pw.includes('@')) return false;
    if (pw == 'paswoord') return false;
    return true;
}

// all passwords
const paswoorden = ['Kleptoe', 'test', 'Azert123', 'rogier@work', 'password', 'MisterNasty12', 'pwnz0red'];

// print all passwords
console.log('Alle paswoorden: ');

for (let i = 0; i < paswoorden.length; i++) {
    console.log(`${i + 1}.${paswoorden[i]}`);
}

// create two lists, for correct and incorrect passwords
const welOk = [];
const nietOk = [];

for (let i = 0; i < paswoorden.length; i++) {
    if (IsCorrectPassword(paswoorden[i])) {
        welOk.push(paswoorden[i]);
    } else {
        nietOk.push(paswoorden[i]);
    }
}

// print the two lists
console.log('OK: ' + welOk.join(', '), 'color: green;');
console.log('NIET OK: ' + nietOk.join(', ', 'color:red;'));