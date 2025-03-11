const filters = document.querySelectorAll('.filters button');
const img = document.querySelector('#van');
const sliderInp = document.querySelector('#sliderInp');
const slider = document.querySelector('#slider');
let previousbutton = 0;

filters.forEach(filter => {
    filter.addEventListener('click', function(e) {
        const filterbutton = e.target;
        const filtername = filterbutton.innerHTML;

        if (previousbutton) {
            previousbutton.classList.remove('actief');            
        }

        filterbutton.classList.add('actiief');
        previousbutton = filterbutton;
        img.classList.remove('grayscale', 'sepia', 'hue', 'blur');
        img.classList.add(filtername);
    });
});

sliderInp.addEventListener('input', function() {
    const Opacityimg = sliderInp.value;
    img.style.opacity = Opacityimg;
    slider.innerHTML = Math.round(Opacityimg * 100) + '%';
});
