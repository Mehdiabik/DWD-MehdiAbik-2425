const form = document.querySelector('#frmAanbieden');
const NaamBieder = form.querySelector('#Naam_bieder');
const Bod = form.querySelector('#Bod');
const Message = form.querySelector('#Message');

let hoogsteBod = 0;
let hoogsteBieder = '';

// HTML validatie uitschakelen
form.setAttribute('novalidate', 'novalidate');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    let numErrors = 0; // Reset het aantal fouten bij elke submit (video rogier)
    Message.innerHTML = ''; // Maak fouten leeg voor nieuwe validatie

    // Controleer of de naam van de bieder is ingevuld
    if (NaamBieder.value == '') {
        Message.innerHTML = 'Naam bieder mag niet leeg zijn.'; // Voeg foutmelding toe en verhoog fouten
        numErrors++;
    }

    if (Bod.value == '') {
        Message.innerHTML = 'Bod mag niet leeg zijn.'; // Voeg foutmelding toe en verhoog fouten
        numErrors++;
    }

    if (Bod.value < hoogsteBod) {
        Message.innerHTML = `Jammer! ${hoogsteBieder} heeft al een hoger bod`; // Andere persoon heeft een hogere bod
        numErrors++;
    }

    // Update dan het hoogste bod en de hoogste bieder enkel als 0 fouten
    if (numErrors === 0) {
        hoogsteBod = Bod.value;
        hoogsteBieder = NaamBieder.value;
        Message.innerHTML = 'Gefeliciteerd! Je hebt momenteel het hoogste bod.';
    }
});