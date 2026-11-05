const header = document.querySelector('.header');
const menuButton = document.querySelector('.header__toggle');

header.classList.add('header--enhanced');

menuButton.addEventListener('click', function () {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
});

header.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.focus();
    }
});

document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) {
        menuButton.setAttribute('aria-expanded', 'false');
    }
});
