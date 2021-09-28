const toc_items = document.querySelectorAll('.toc__item');

toc_items.forEach(item => {
    item.addEventListener('click', navigate);
})

async function navigate(event) {
    event.stopPropagation();
    let sectionId = this.getAttribute('sb');
    let newSection = document.getElementById(sectionId);
    let currentSection = document.querySelector('section.visible');
    currentSection.classList.remove('visible');
    currentSection.classList.add('hidden');
    newSection.classList.remove('hidden');
    newSection.classList.add('visible');
    // await sleep(1);
    window.scrollTo(0, 0);
}