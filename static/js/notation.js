import Vex from 'vexflow';

window.addEventListener('resize', generateNotation);
document.addEventListener('DOMContentLoaded', generateNotation);
timeSigs.forEach(button => {
  button.addEventListener('click', generateNotation);
})
window.addEventListener('dragend', generateNotation);
window.addEventListener('touchend', generateNotation);


const vf = Vex.Flow;

let notationContainer = document.getElementById('notation-container');
let renderer = new vf.Renderer(notationContainer, vf.Renderer.Backends.SVG);


function generateNotation() {
  let notationContainer = document.getElementById('notation-container');
  notationContainer.firstChild.remove();
  let renderer = new vf.Renderer(notationContainer, vf.Renderer.Backends.SVG);

  let width = notationContainer.offsetWidth;
  
  renderer.resize(width, 100);
  const context = renderer.getContext();
  
  const stave = new vf.Stave(0, 0, width);

  let selectedTimeSig = document.querySelector('.time-signature.pressed').getAttribute('signature');
  
  stave.addClef('percussion').addTimeSignature(selectedTimeSig, 10);
  stave.setContext(context).draw();

  let placedNotes = document.querySelectorAll('.placed');
  let notes = [];
  placedNotes.forEach(noteBlock => {
    let duration = noteBlock.getAttribute('vf-duration');
    let dotted = noteBlock.getAttribute('dotted');
    let toAppend = new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: duration});
    toAppend.setStyle({fillStyle: noteBlock.getAttribute('note-color'), strokeStyle: 'black'});
    toAppend.setFlagStyle({fillStyle: 'black', strokeStyle: 'black'});
    if (dotted === 'true') {
      toAppend.addDotToAll();
    }
    notes.push(toAppend);
  })
  
  let beams = vf.Beam.generateBeams(notes);
  if (selectedTimeSig === '6/8') {
    beams = vf.Beam.generateBeams(notes, {
      groups: [new vf.Fraction(3, 8)]
    });
  }
  
  const voice = new vf.Voice({num_beats: 4, beat_value:4}).setStrict(false);
  voice.addTickables(notes);
  
  let startX = stave.getNoteStartX();

  const formatter = new vf.Formatter().joinVoices([voice]).format([voice], width - startX);
  
  
  voice.draw(context, stave);

  beams.forEach(beam => {
    beam.setContext(context).draw();
  })
  outlineNotes();
}

function outlineNotes() {
  let notes = document.querySelectorAll('.vf-notehead>path');
  notes.forEach(note => {
    note.setAttribute('stroke', 'black');
  })
}
