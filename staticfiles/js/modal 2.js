const helpButton = document.querySelector("#help-button");
const closeButton = document.querySelector(".modal-close");

helpButton.addEventListener('click', openHelp);
closeButton.addEventListener('click', closeModal);

function openHelp() {
    console.log('click');
    const helpModal = document.querySelector('.overlay--help');
    helpModal.classList.remove('hidden');

}

function closeModal() {
    const helpModal = document.querySelector('.overlay:not(.hidden)');
    helpModal.classList.add('hidden');

}