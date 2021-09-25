import Vex from 'vexflow'

window.addEventListener('resize', learnNotation);

const contBtns = document.querySelectorAll('.btn--continue');
const prevBtns = document.querySelectorAll('.btn--previous');
contBtns.forEach(btn => {
    btn.addEventListener('click', learnNotation);
});
prevBtns.forEach(btn => {
    btn.addEventListener('click', learnNotation);
});


const vf = Vex.Flow;


function learnNotation() {
    let visibleSection = document.querySelector('.visible');
    let notationContainer = visibleSection.querySelector('.notation');
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
    notesToAdd.forEach(note => {
        let dotted = false;
        if (note.endsWith('.')) {
            dotted = true;
            note = note.replace('.', '');
        };
        let toAppend = new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: note});
        if (dotted) {
            toAppend.addDotToAll();
        };
        notes.push(toAppend);
    });
    
    let beams = vf.Beam.generateBeams(notes);
    if (timeSig === '6/8') {
        beams = vf.Beam.generateBeams(notes, {
          groups: [new vf.Fraction(3, 8)]
        });
      }
    
    
    const voice = new vf.Voice({num_beats: 4, beat_value:4}).setStrict(false);
    voice.addTickables(notes);
    
    let startX = stave.getNoteStartX();
    
    const formatter = new vf.Formatter().joinVoices([voice]).format([voice], width - startX);
    
    voice.draw(context, stave);
}