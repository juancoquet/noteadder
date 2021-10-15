document.addEventListener('DOMContentLoaded', indexSections);
window.addEventListener('resize', positionSplitter);

const sections = document.querySelectorAll('.learn-section');
const continueButtons = document.querySelectorAll('.btn--continue');
const prevButtons = document.querySelectorAll('.btn--previous');
const tocItems = document.querySelectorAll('.toc__item');

continueButtons.forEach(btn => {
    btn.addEventListener('click', continueSection);
});
prevButtons.forEach(btn => {
    btn.addEventListener('click', prevSection);
});
tocItems.forEach(item => {
    item.addEventListener('click', positionSplitter);
})


function indexSections() {
    let i = 0;
    sections.forEach(section => {
        section.setAttribute('index', i);
        i++;
    });
}

function continueSection() {
    let parent = document.querySelector('section:not(.hidden)');
    let nextIndex = parseInt(parent.getAttribute('index')) + 1;
    parent.classList.remove('visible');
    parent.classList.add('hidden');

    let nextSection = document.querySelector('[index="' + nextIndex + '"]');
    nextSection.classList.remove('hidden');
    nextSection.classList.add('visible');
    window.scrollTo(0, 0);
    updateToCBtn();
    positionSplitter();
    positionValue(nextSection);
}

function prevSection() {
    let parent = document.querySelector('section:not(.hidden)');
    let prevIndex = parseInt(parent.getAttribute('index')) - 1;
    parent.classList.remove('visible');
    parent.classList.add('hidden');
    
    let previousSection = document.querySelector('[index="' + prevIndex + '"]');
    previousSection.classList.remove('hidden');
    previousSection.classList.add('visible');
    window.scrollTo(0, 0);
    updateToCBtn();
    positionSplitter();
}

async function positionSplitter() {
    let splitters = document.querySelectorAll('.splitter');
    splitters.forEach(splitter => {
        splitter.style.opacity = 0;
    });
    await sleep(0.01);  // wait 10ms for dom objecs to position properly
    let i = 0;
    let notes = document.querySelectorAll('.split-note');

    splitters.forEach(splitter => {
        splitter.style.opacity = 1;
        let note = notes[i];
        let noteBoundaries = note.getBoundingClientRect();
        let noteTop = noteBoundaries.top;
        let noteHeight = noteBoundaries.height;
        let splitterHeight = splitter.getBoundingClientRect().height;
        let difference = splitterHeight - noteHeight;
        splitter.style.top = noteTop - (difference/2) + 'px';    
    
        let noteWidth = noteBoundaries.width;
        let noteLeft = noteBoundaries.left;
        splitter.style.left = noteLeft + (noteWidth / 2) + 'px';
        i++;
    })
}

function updateToCBtn() {
    let section = document.querySelector('section.visible');
    let tocBtn = document.querySelector('.btn--toc');
    let icon = tocBtn.querySelector('.toc-icon');
    let title = section.querySelector('.title').textContent;
    tocBtn.innerHTML = '';
    tocBtn.appendChild(icon);
    tocBtn.innerHTML += title;
}

function sleep(s) {
    let ms = s * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
    // call await sleep(s); inside an async fucntion to use.
}