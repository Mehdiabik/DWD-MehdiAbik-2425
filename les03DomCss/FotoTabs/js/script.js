const headerViews = document.querySelector('.header__view');
const iconViewGrid = headerViews.querySelector('#lnkViewGrid');
const iconViewList = headerViews.querySelector('#lnkViewList');
const navLinks = document.querySelectorAll('.nav__filters a');
const gallery = document.querySelector('#gallery');
const gridFigure = gallery.querySelectorAll('figure');
const numFound = document.querySelector('#numFound');

function aantalNumFound() {
    numFound.innerHTML = document.querySelectorAll('#gallery figure[style*="display: block"]').length;
}
function switchToListView() {
    iconViewList.classList.add('active');
    iconViewGrid.classList.remove('active');
    gallery.classList.add('viewList');
}

function switchToGridView() {
    iconViewGrid.classList.add('active');
    iconViewList.classList.remove('active');
    gallery.classList.remove('viewList');
}
navLinks.forEach(navLink => {
    navLink.addEventListener('click', function(e) {
        e.preventDefault();
        const filter = navLink.dataset.filter;

        navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');

        gridFigure.forEach(item => {
            item.style.display = 'none';
            if (item.dataset.filters.includes(filter) || filter == 'alle') {
                item.style.display = 'block';
            }
        });
        iconViewList.addEventListener('click', function(e) {
            e.preventDefault();
            switchToListView();
        });
        iconViewGrid.addEventListener('click', function(e) {
            e.preventDefault();
            switchToGridView();
        });
        aantalNumFound();
    });
});

