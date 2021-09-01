const timeSigs = document.querySelectorAll('.time-signature');

document.addEventListener('DOMContentLoaded', calculateBlockWidths);

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

    // delete all placed notes
    let placed = document.querySelectorAll('.placed');
    placed.forEach(block => {
        block.remove();
    })

    calculateBlockWidths();
    calculateAllowedNotes();    // defined in drag.js
}

function calculateBlockWidths() {
    let noteBlocks = document.querySelectorAll('.note-block');
    let barValue = bar.getAttribute('value');
    noteBlocks.forEach(noteBlock => {
        let noteValue = noteBlock.getAttribute('value');
        let newWidth = 100 / (barValue / noteValue);
        noteBlock.style.width = newWidth + '%';
    })
}