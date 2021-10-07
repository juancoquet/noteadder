const timeSigs = document.querySelectorAll('.time-signature');
const dotToggle = document.querySelector('.dot-toggle');

// window.addEventListener('resize', calculateBlockWidths);
document.addEventListener('DOMContentLoaded', resetDotted);
document.addEventListener('DOMContentLoaded', buildMetronome);
dotToggle.addEventListener('click', toggleDotted);

timeSigs.forEach(button => {
    button.addEventListener('click', timeSigPress);
})

let metronomeNotes = [];

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
    bar.setAttribute('time-sig', this.getAttribute('signature'));

    // delete all placed notes
    let placed = document.querySelectorAll('.placed');
    placed.forEach(block => {
        block.remove();
    })

    calculateBlockWidths();
    calculateAllowedNotes();    // defined in drag.js

    calculatePlayEnabled();        // defined in playback.js
    changeToneTimeSig();
    buildMetronome();

    showCount();
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

function changeToneTimeSig() {
    Tone.Transport.timeSignature = parseFloat(bar.getAttribute('absolute-value'));
}

function buildMetronome() {
    let timeSig = document.querySelector('.time-signature.pressed');
    let top = parseInt(timeSig.getAttribute('top'));
    metronomeNotes = ['C5'];
    for (let i = 1; i < top; i++) {
        metronomeNotes.push('C4');
    }
    metronomeNotes = metronomeNotes.concat(metronomeNotes);
    // [...Array(top-1).keys()].forEach(() => {
    //     metronomeNotes.push('C4');
    // })
}


// Dotted functions

function toggleDotted() {
    let noteBlocks = document.querySelectorAll('.note-block:not(.placed)');
    if (this.checked) {
        noteBlocks.forEach(block => {
            let dottedVal = block.getAttribute('value') * 1.5;
            block.setAttribute('value', dottedVal);
            block.setAttribute('dotted', true);
            if (block.classList.contains('rest')) {
                let newDuration = block.getAttribute('vf-duration').replace('r', 'dr');
                block.setAttribute('vf-duration', newDuration);
            } else {
                let newDuration = block.getAttribute('vf-duration').concat('d');
                block.setAttribute('vf-duration', newDuration);
            };
            let tonejsDuration = block.getAttribute('tonejs-duration');
            block.setAttribute('tonejs-duration', tonejsDuration.concat('.'))
        });
    } else {
        noteBlocks.forEach(block => {
            let originalVal = block.getAttribute('value') * (2/3);
            block.setAttribute('value', originalVal);
            block.setAttribute('dotted', false);
            if (block.classList.contains('rest')) {
                let dottedDuration = block.getAttribute('vf-duration');
                let newDuration = dottedDuration.replace('dr', 'r');
                block.setAttribute('vf-duration', newDuration);
            } else {
                let dottedDuration = block.getAttribute('vf-duration');
                let newDuration = dottedDuration.slice(0, -1);
                block.setAttribute('vf-duration', newDuration);
            }
            let newTonejsDuration = block.getAttribute('tonejs-duration').slice(0, -1);
            block.setAttribute('tonejs-duration', newTonejsDuration);
        })
    }
    replaceNotes();
    calculateBlockWidths();
    calculateAllowedNotes();
}

function resetDotted() {
    let chBox = document.querySelector('.dot-toggle');
    chBox.checked = false;
}

function replaceNotes() {
    let blocks = document.querySelectorAll('.note-block:not(.placed)');
    let chBox = document.querySelector('.dot-toggle');
    blocks.forEach(block => {
        let note = block.querySelector('.block-note-label');
        let src = note.getAttribute('src');
        let filename = src.split("/").pop();
        if (chBox.checked) {
            let d_filename = "d_" + filename;
            note.setAttribute('src', `/static/svg/${d_filename}`);
            note.classList.add('dotted');
        } else {
            filename = filename.replace('d_', '');
            note.setAttribute('src', `/static/svg/${filename}`);
            note.classList.remove('dotted');
        }
    })
}


// counting labels

function showCount() {
    let currentCount = document.querySelector('.count:not(.hidden)');
    currentCount.classList.add('hidden');

    let clickedSig = document.querySelector('.time-signature.pressed');
    let clickedSigTopNum = clickedSig.getAttribute('top');
    let toReveal = document.querySelector('.count--' + clickedSigTopNum);
    toReveal.classList.remove('hidden');
}