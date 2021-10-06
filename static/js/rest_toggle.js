const restToggle = document.querySelector('.rest-toggle');

document.addEventListener('DOMContentLoaded', function f() {restToggle.checked = false});
restToggle.addEventListener('click', toggleRest);


function toggleRest() {
    let noteBlocks = document.querySelectorAll('.note-block:not(.placed):not(.rest)');
    let restBlocks = document.querySelectorAll('.note-block.rest:not(.placed)')
    
    if (this.checked) {
        noteBlocks.forEach(block => {
            block.classList.add('hidden');
        })
        restBlocks.forEach(block => {
            block.classList.remove('hidden');
        })
    } else {
        restBlocks.forEach(block => {
            block.classList.add('hidden');
        })
        noteBlocks.forEach(block => {
            block.classList.remove('hidden');
        })
    }
}