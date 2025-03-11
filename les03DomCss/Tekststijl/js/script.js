const tekstVoorbeeld = document.querySelector('#tekstVoorbeeld');
const grootteRegelaar = document.querySelector('#grootteRegelaar');
const grootteLabel = document.querySelector('#grootteLabel');
const kleurkiezer = document.querySelector('#kleurSelector');
const vetCheckbox = document.querySelector('#vet');
const schuinCheckbox = document.querySelector('#schuin');
const hoofdletterCheckbox = document.querySelector('#hoofdletter');

const updateTekstStijl = () => {
    tekstVoorbeeld.style.fontSize = `${grootteRegelaar.value}px`;
    grootteLabel.textContent = grootteRegelaar.value;
    tekstVoorbeeld.style.color = kleurkiezer.value;
    tekstVoorbeeld.style.fontWeight = vetCheckbox.checked ? 'bold' : 'normal';
    tekstVoorbeeld.style.fontStyle = schuinCheckbox.checked ? 'italic' : 'normal';
    tekstVoorbeeld.style.textTransform = hoofdletterCheckbox.checked ? 'uppercase' : 'none';
};

grootteRegelaar.addEventListener('input', updateTekstStijl);
kleurkiezer.addEventListener('input', updateTekstStijl);
vetCheckbox.addEventListener('change', updateTekstStijl);
schuinCheckbox.addEventListener('change', updateTekstStijl);
hoofdletterCheckbox.addEventListener('change', updateTekstStijl);

const voegOpmaak1Toe = () => {
    tekstVoorbeeld.classList.remove('opmaak1', 'opmaak2', 'opmaak3');
    tekstVoorbeeld.classList.add('opmaak1');
};

const voegOpmaak2Toe = () => {
    tekstVoorbeeld.classList.remove('opmaak1', 'opmaak2', 'opmaak3');
    tekstVoorbeeld.classList.add('opmaak2');
};

const voegOpmaak3Toe = () => {
    tekstVoorbeeld.classList.remove('opmaak1', 'opmaak2', 'opmaak3');
    tekstVoorbeeld.classList.add('opmaak3');
};

document.querySelector('#opmaak1').addEventListener('click', voegOpmaak1Toe);
document.querySelector('#opmaak2').addEventListener('click', voegOpmaak2Toe);
document.querySelector('#opmaak3').addEventListener('click', voegOpmaak3Toe);

updateTekstStijl(); // Vragen aan leerkracht of dit nodig is of niet, afwerken als ik tijd heb