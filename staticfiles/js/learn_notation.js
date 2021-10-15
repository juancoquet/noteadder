import Vex from 'vexflow'

window.addEventListener('resize', learnNotation);

const contBtns = document.querySelectorAll('.btn--continue');
const prevBtns = document.querySelectorAll('.btn--previous');
const tocItems = document.querySelectorAll('.toc__item');
contBtns.forEach(btn => {
    btn.addEventListener('click', learnNotation);
});
prevBtns.forEach(btn => {
    btn.addEventListener('click', learnNotation);
});
tocItems.forEach(item => {
    item.addEventListener('click', learnNotation);
})


const vf = Vex.Flow;


// Dynamically generate stave, time sig and notes by parsing from HTML attrs.
// To add notation, make a div with class "notation", a 'time-signature' attr, and 
// add a 'notes' attr with comma-separated note values
// eg <div time-signature="2/4" notes="q,8r,16,16,bl,qr.,8"' class="notation"></div>
// 'r' means rest, '.' means dotted note, 'bl' means barline.

function learnNotation() {
    let visibleSection = document.querySelector('.visible');
    let notationContainers = visibleSection.querySelectorAll('.notation');

    notationContainers.forEach(notationContainer => {
        if (notationContainer.children.length != 0) {
            notationContainer.firstChild.remove();
        }
        
        let width = notationContainer.parentElement.offsetWidth;
        if (width > 600) {
            width = 600;
        }
        let renderer = new vf.Renderer(notationContainer, vf.Renderer.Backends.SVG);
        renderer.resize(width, 100);
        const context = renderer.getContext();
        
        const stave = new vf.Stave(0, 0, width);
        stave.addClef('percussion');
        
        let timeSig = notationContainer.getAttribute('time-signature');
        if (timeSig) {
            stave.addTimeSignature(timeSig, 10);
        }
        
        stave.setContext(context).draw();
        
        
        let notesToAdd = notationContainer.getAttribute('notes').split(',');
        let notes = [];
        if (notesToAdd[0] != "") {
            notesToAdd.forEach(note => {
                notes.push(parseNote(note));
            });
        }
            
        let beams = vf.Beam.generateBeams(notes);
        if (timeSig === '6/8') {
            beams = vf.Beam.generateBeams(notes, {
                groups: [new vf.Fraction(3, 8)]
            });
        }
        
        const voice = new vf.Voice({num_beats: 4, beat_value:4}).setStrict(false);
        voice.addTickables(notes);
        
        let startX = 0;
        if (notes.length > 0) {
            startX = stave.getNoteStartX();
            const formatter = new vf.Formatter().joinVoices([voice]).format([voice], width - startX);
        }
        
        voice.draw(context, stave);
        
        beams.forEach(beam => {
            beam.setContext(context).draw();
        });
    });
}

function parseNote(note) {
    let dotted = false;
    if (note.endsWith('.')) {
        dotted = true;
        note = note.replace('.', '');
    };
    let toAppend;
    if (note == 'bl') {
        toAppend = new vf.BarNote();
    } else {
        toAppend = new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: note});
        if (dotted) {
            toAppend.addDotToAll();
        };
    }
    return toAppend;
}