const toc_items = document.querySelectorAll('.toc__item');
const tocBtn = document.querySelector('.btn--toc');
const tocOverlay = document.querySelector('.overlay--toc');
const closeBtn = document.querySelector('.modal-close');

toc_items.forEach(item => {
    item.addEventListener('click', navigate);
})

function navigate(event) {
    event.stopPropagation();
    let sectionId = this.getAttribute('sb');
    let newSection = document.getElementById(sectionId);
    let currentSection = document.querySelector('section.visible');
    currentSection.classList.remove('visible');
    currentSection.classList.add('hidden');
    newSection.classList.remove('hidden');
    newSection.classList.add('visible');
    tocOverlay.classList.add('hidden');
    updateToCBtn();
    window.scrollTo(0, 0);
}


tocBtn.addEventListener('click', displayToC);

function displayToC() {
    tocOverlay.classList.remove('hidden');
}

closeBtn.addEventListener('click', closeToC);

function closeToC() {
    tocOverlay.classList.add('hidden');
}

function updateToCBtn() {
    let section = document.querySelector('section.visible');
    let icon = tocBtn.querySelector('.toc-icon');
    let title = section.querySelector('.title').textContent;
    tocBtn.innerHTML = '';
    tocBtn.appendChild(icon);
    tocBtn.innerHTML += title;
}