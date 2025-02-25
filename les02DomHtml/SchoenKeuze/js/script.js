const frm = document.querySelector('#frmOrder');
const inpEmail = frm.querySelector('#inpEmail');
const msgEmail = frm.querySelector('.message');
const selMeasure = frm.querySelector('#selMeasure');
const msgMeasure = frm.querySelector('#msgMeasure');
const thumbLinks = document.querySelectorAll('#model a');
const figShoe = document.querySelector('#figShoe');
const imgShoe = figShoe.querySelector('img');
const captShoe = figShoe.querySelector('figcaption span');
const orderForm = document.querySelector('#frmOrder');
const lblMessage = document.querySelector('#lblMessage');
const checkboxes = document.querySelectorAll('#accessoires input[type="checkbox"]');
const basePrice = 54.99;


frm.setAttribute('novalidate', 'novalidate');

frm.addEventListener('submit', function(e) {
  e.preventDefault();
  let numErrors = 0; // clear error messages email
  msgEmail.innerHTML = ''; // clear error messages size
  msgMeasure.innerHTML = '';
  if (inpEmail.value == '') {
    msgEmail.innerHTML = 'Email mag niet leeg zijn'; // check empty email
    numErrors++;
  }
  if (selMeasure.value == '') {
    msgMeasure.innerHTML = 'Kies alstublieft een maat.'; // check empty size

    numErrors++;
  }
  if (numErrors == 0) {
    frm.submit();
  }
});
thumbLinks.forEach(function(lnk) {
  lnk.addEventListener('click', function(e) {
    e.preventDefault(); // Voorkom dat de link de pagina herlaadt /video rogier/

    // update de afbeelding en de tekst
    imgShoe.src = lnk.href;
    captShoe.textContent = lnk.textContent;

    // verwijder de 'selected' klase
    thumbLinks.forEach(function(link) {
      link.classList.remove('selected');
    });

    // voeg de 'selected' klasse toe aan de link
    lnk.classList.add('selected');
  });
});


orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Lees de model
  const selectedModel = document.querySelector('#model .selected').textContent;

  // Lees de schoenmaat
  const shoeSize = selMeasure.value;

  // Basisprijs (€ 54.99) 
  let totalPrice = basePrice;

  // Optelling prijs
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      totalPrice += parseFloat(checkbox.value);
    }
  });

  // Eind tekst 
  const message = `Je keuze: ${selectedModel} maat ${shoeSize}, totaalprijs: € ${totalPrice}`;

  lblMessage.textContent = message;
});
