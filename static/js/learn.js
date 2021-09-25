document.addEventListener('DOMContentLoaded', indexSections);

const sections = document.querySelectorAll('.learn-section');
const continueButtons = document.querySelectorAll('.btn--continue');
const prevButtons = document.querySelectorAll('.btn--previous');

continueButtons.forEach(btn => {
    btn.addEventListener('click', continueSection);
});
prevButtons.forEach(btn => {
    btn.addEventListener('click', prevSection);
});

function indexSections() {
    let i = 0;
    sections.forEach(section => {
        section.setAttribute('index', i);
        i++;
    });
}

function continueSection() {
    let parent = this.parentElement;
    let nextIndex = parseInt(parent.getAttribute('index')) + 1;
    parent.classList.remove('visible');
    parent.classList.add('hidden');

    let nextSection = document.querySelector('[index="' + nextIndex + '"]');
    nextSection.classList.remove('hidden');
    nextSection.classList.add('visible');
}

function prevSection() {
    let parent = this.parentElement;
    let prevIndex = parseInt(parent.getAttribute('index')) - 1;
    parent.classList.remove('visible');
    parent.classList.add('hidden');

    let previousSection = document.querySelector('[index="' + prevIndex + '"]');
    previousSection.classList.remove('hidden');
    previousSection.classList.add('visible');
}