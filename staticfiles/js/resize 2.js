const noteToggles = document.querySelector('.control-panel--notes');
const help = document.querySelector('#help-button');

const section = document.querySelector('.notation-container');
const noteGroup = document.querySelector('.note-group');
const body = document.querySelector('body');

window.addEventListener('resize', reorderDOM);
document.addEventListener('DOMContentLoaded', reorderDOM);

function reorderDOM() {
    if (window.innerWidth > 700) {
        section.appendChild(noteToggles);
        section.appendChild(help);
    } else {
        noteGroup.appendChild(noteToggles);
        body.appendChild(help);
    }
}