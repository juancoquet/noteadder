import Vex from 'vexflow';

document.addEventListener('DOMContentLoaded', generateNotation);
timeSigs.forEach(button => {
  button.addEventListener('click', generateNotation);
})

const vf = Vex.Flow;


function generateNotation() {
  const notationContainer = document.getElementById('notation-container');
  const renderer = new vf.Renderer(notationContainer, vf.Renderer.Backends.SVG);
  
  renderer.resize(500, 150);
  const context = renderer.getContext();
  
  const stave = new vf.Stave(0, 0, 400);

  let selectedTimeSig = document.querySelector('.time-signature.pressed').getAttribute('signature');
  
  stave.addClef('percussion').addTimeSignature(selectedTimeSig, 0);
  
  const notes = [
    new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: 'q'}),
    new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: 'q'}),
    new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: 'qd'}).addDotToAll(),
    new vf.StaveNote({clef: 'percussion', keys: ['c/5'], duration: '8'}),
  ];
  
  const voice = new vf.Voice({num_beats: 4, beat_value:4});
  voice.addTickables(notes);
  
  const formatter = new vf.Formatter().joinVoices([voice]).format([voice], 400);
  
  stave.setContext(context).draw();
  voice.draw(context, stave);
}