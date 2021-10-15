const menu = document.querySelector('#menu');
const menuClose = document.querySelector('#close-menu');
const nav = document.querySelector('.navbar');

menu.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);

function openMenu() {
    nav.classList.remove('hidden');
    menuClose.classList.remove('hidden');
    menu.classList.add('hidden');
}

function closeMenu() {
    nav.classList.add('hidden');
    menuClose.classList.add('hidden');
    menu.classList.remove('hidden');
}