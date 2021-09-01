const timeSigs = document.querySelectorAll('.time-signature');
const dotToggle = document.querySelector('.dot-toggle');

document.addEventListener('DOMContentLoaded', calculateBlockWidths);
dotToggle.addEventListener('click', toggleDotted);

timeSigs.forEach(button => {
    button.addEventListener('click', timeSigPress);
})


// Time signature button functions

function timeSigPress() {
    const oldSig = document.querySelector('.pressed');
    oldSig.classList.remove('pressed');
    this.classList.add('pressed');

    const topNum = parseInt(this.getAttribute('top'));
    const bottomNum = parseFloat(this.getAttribute('bottom-value'));
    const newBarLen = topNum * bottomNum;
    bar.setAttribute('value', newBarLen);   // bar is defined in drag.js
    bar.setAttribute('absolute-value', newBarLen);

    // delete all placed notes
    let placed = document.querySelectorAll('.placed');
    placed.forEach(block => {
        block.remove();
    })

    calculateBlockWidths();
    calculateAllowedNotes();    // defined in drag.js
}

function calculateBlockWidths() {
    let noteBlocks = document.querySelectorAll('.note-block:not(.placed)');
    let barValue = bar.getAttribute('absolute-value');
    noteBlocks.forEach(noteBlock => {
        let noteValue = noteBlock.getAttribute('value');
        let newWidth = 100 / (barValue / noteValue);
        noteBlock.style.width = newWidth + '%';
    })
}

function toggleDotted() {
    // TODO: update note symbol on change
    let noteBlocks = document.querySelectorAll('.note-block:not(.placed)');
    if (this.checked) {
        noteBlocks.forEach(block => {
            let dottedVal = block.getAttribute('value') * 1.5;
            block.setAttribute('value', dottedVal);
        })
    } else {
        noteBlocks.forEach(block => {
            let originalVal = block.getAttribute('value') * (2/3);
            block.setAttribute('value', originalVal);
        })
    }
    calculateBlockWidths();
    calculateAllowedNotes();
}