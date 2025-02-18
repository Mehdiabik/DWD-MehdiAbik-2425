// Definieer constanten
const AANTAL_SPELERS = 10000;
const MIN_GETAL = 1000;
const MAX_GETAL = 9999;

// Winstbedragen
// eslint-disable-next-line no-magic-numbers
const WINST = [0, 5 / 2, 10, 100, 500];

// Functie om een willekeurig getal te genereren tussen MIN_GETAL en MAX_GETAL
function genereerGetal() {
    const randomgetal = Math.floor(Math.random() * (MAX_GETAL - MIN_GETAL + 1)) + MIN_GETAL;
    return randomgetal;
}

// Functie om het aantal juiste cijfers te bepalen
function aantalJuisteCijfers(getrokken, gok) {
    if (getrokken === gok) return 4;
    if (getrokken % 1000 === gok % 1000) return 3;
    if (getrokken % 100 === gok % 100) return 2;
    if (getrokken % 10 === gok % 10) return 1;
    return 0;
}

// Simulatie
const getrokkenGetal = genereerGetal();
const winnaars = [0, 0, 0, 0, 0];
let totaleWinst = 0;

for (let i = 0; i < AANTAL_SPELERS; i++) {
    const gok = genereerGetal();
    const juisteCijfers = aantalJuisteCijfers(getrokkenGetal, gok);
    winnaars[juisteCijfers]++;
    totaleWinst += WINST[juisteCijfers];
}

// Gemiddelde winst per speler
const gemiddeldeWinst = totaleWinst / AANTAL_SPELERS;

// Resultaten weergeven in de console
console.log('%c// trekking', 'color: magenta; font-weight: bold; font-size:30px');
console.log('%cgetrokken getal: ' + getrokkenGetal, 'color: yellow;');
console.log('\n%c// gokken', 'color: magenta; font-weight: bold; font-size:30px');
console.log('aantal iteraties: ' + AANTAL_SPELERS);
console.log('\n%c// resultaten', 'color: magenta; font-weight: bold; font-size:30px');
for (let i = 0; i < winnaars.length; i++) {
    console.log(i + ' juist: ' + winnaars[i]);
}
console.log('%c\ngemiddelde winst: €' + gemiddeldeWinst.toFixed(3), 'background: lightgray; color: olive; padding: 2px;');