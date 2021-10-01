const playButton = document.querySelector('.play');

window.addEventListener('DOMContentLoaded', setMarkerHeights);
playButton.addEventListener('click', playMetronome);
playButton.addEventListener('click', playNotes);
playButton.addEventListener('click', showNotationMarker);
playButton.addEventListener('click', animateBarMarker);
playButton.addEventListener('click', disablePlayButtonDuringPlayback);
playButton.addEventListener('click', disableTimeSigsDuringPlayback);
playButton.addEventListener('click', disablePlacedNotesDuringPlayback);
playButton.addEventListener('click', easterEgg);


// Metronome playback  --------------------------------------------------------

const click = new Tone.Sampler({
    urls: {
        "C5": "static/js/playback/sounds/metronome-up.mp3",
        "C4": "static/js/playback/sounds/metronome.mp3",
    },
    release: 1,
}).toDestination();

function playMetronome () {
    let timeSig = document.querySelector('.time-signature.pressed');
    let bottom = parseInt(timeSig.getAttribute('bottom'));

    let now = Tone.now();
    let startTimes = [now, ];
    let i = 0;
    for (let note of metronomeNotes) {      // metronomeNotes defined in time-signatures.js
        if (i === metronomeNotes.length-1) { break; };
        let duration = Tone.Time(bottom + 'n').toSeconds();
        let nextStart = startTimes[i] + duration;
        startTimes.push(nextStart);
        i++;
    }

    for (let i = 0; i < metronomeNotes.length; i++) {
        click.triggerAttackRelease(metronomeNotes[i], '4n', startTimes[i]);
    }
};



// Note playback -------------------------------------------------------------

const synth = new Tone.Synth();
synth.envelope.attack = 0.001;
synth.envelope.release = 0.01;

const gain = new Tone.Gain(0.3).toDestination();
synth.connect(gain);

function playNotes() {    
    let noteData = getNoteData();
    let notes = noteData.notes;
    let startTimes = noteData.startTimes;
    let velocities = noteData.velocities;
    
    for (let i = 0; i < notes.length; i++) {
        synth.triggerAttackRelease('E4', notes[i], startTimes[i], velocities[i]);
      }
}

function getNoteData() {
    let placed = document.querySelectorAll('.placed');
    let notes = [];
    let velocities = [];
    for (let block of placed) {
        notes.push(block.getAttribute('tonejs-duration'));
        velocities.push(+! block.classList.contains('rest')); // +! turns true=>0, false=>1
    };

    let now = Tone.now();
    let oneMeasure = Tone.Time('1m').toSeconds();
    let startTimes = [now + oneMeasure, ];
    
    let i = 0;
    for (let note of notes) {
        if (i === notes.length-1) { break; };
        let duration = Tone.Time(note).toSeconds();
        let nextStart = startTimes[i] + duration;
        startTimes.push(nextStart);
        i++;
    }
    return { startTimes: startTimes, notes: notes, velocities: velocities }
}



// Markers -------------------------------------------------------------------

async function showNotationMarker() {
    let marker = document.querySelector('.playback-marker');
    marker.style.opacity = 1;
    let drawnNotes = document.querySelectorAll('.vf-note');
    let notePositions = [];
    drawnNotes.forEach(note => {
        let boundaries = note.getBoundingClientRect();
        notePositions.push(boundaries.left);
    })

    let noteData = getNoteData()
    let sleepVals = getSleepValues(noteData.notes);
    let lastVal = sleepVals.pop();
    
    for (let i = 0; i < sleepVals.length; i++) {
        await sleep(sleepVals[i]);
        marker.style.left = notePositions[i] - 4 + 'px';
    }
    await sleep(lastVal);
    resetNotationMarker();
}

function setMarkerHeights() {
    window.scrollTo(0, 0);
    // notation marker
    let marker = document.querySelector('.playback-marker--notation');
    let barline = document.getElementsByTagName('path')[0];
    let staveTop = barline.getBoundingClientRect().top;
    let markerHeight = marker.getBoundingClientRect().height;
    let difference = markerHeight - 44;
    marker.style.top = staveTop - (difference/2) + 'px';

    // bar marker
    marker = document.querySelector('.playback-marker--bar');
    let bar = document.querySelector('.bar-container');
    let barBoundaries = bar.getBoundingClientRect();
    let barTop = barBoundaries.top;
    let barHeight = barBoundaries.height;
    markerHeight = marker.getBoundingClientRect().height;
    difference = markerHeight - barHeight;
    marker.style.top = barTop - (difference/2) + 'px';
}

function resetNotationMarker() {
    let marker = document.querySelector('.playback-marker--notation');
    let barline = document.getElementsByTagName('path')[0];
    marker.style.opacity = 0;
    marker.style.left = barline.getBoundingClientRect().left + 'px';
}

async function animateBarMarker() {
    let barDuration = Tone.Time('1m').toSeconds();
    let marker = document.querySelector('.playback-marker--bar');
    marker.style.opacity = 1;
    await sleep(barDuration);
    let bar = document.querySelector('.bar-container');
    let barBoundaries = bar.getBoundingClientRect();
    marker.style.transition = `${barDuration}s linear`;
    marker.style.transform = `translateX(${barBoundaries.width}px)`;
    await sleep(barDuration);
    marker.style.transition = '0s';
    
    // reset
    marker.style.opacity = 0;
    marker.style.transform = 'none';
}



// Utility -------------------------------------------------------------------

function getSleepValues(notes) {
    notes.unshift('1m');
    values = [];
    for (let note of notes) {
        let value = Tone.Time(note).toSeconds();
        values.push(value);
    }
    return values;
}

function sleep(s) {
    let ms = s * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
    // call await sleep(s); inside an async fucntion to use.
}

async function disablePlayButtonDuringPlayback() {
    let playButton = document.querySelector('.play');
    playButton.classList.remove('play--active');
    let barDuration = Tone.Time('1m').toSeconds();
    await sleep(barDuration * 2);
    playButton.classList.add('play--active');
}

async function disableTimeSigsDuringPlayback() {
    let timeSigs = document.querySelectorAll('.time-signature');
    timeSigs.forEach(sig => {
        sig.classList.add('disabled');
    })
    let barDuration = Tone.Time('1m').toSeconds();
    await sleep(barDuration * 2);
    timeSigs.forEach(sig => {
        sig.classList.remove('disabled');
    })
}

async function disablePlacedNotesDuringPlayback() {
    let placedNotes = document.querySelectorAll('.placed');
    placedNotes.forEach(block => {
        block.classList.add('disabled');
        block.setAttribute('draggable', 'false');
    })
    let barDuration = Tone.Time('1m').toSeconds();
    await sleep(barDuration * 2);
    placedNotes.forEach(block => {
        block.classList.remove('disabled');
        block.setAttribute('draggable', 'true');
    })
}

function easterEgg() {
    let triggerPhrase = ['qr', '8r', '16', '16', '16r', '16', '16', '16', '16', '16', '16', '16'];
    let triggerPhrase2 = ['qdr', '16', '16', '16r', '16', '16', '16', '16', '16', '16', '16'];
    let triggerPhrase3 = ["16", "16", "16r", "16", "16", "16r", "16", "16", "16r", "16", "16", "16r", "8", "8"]
    let triggerPhrase4 = ["16", "8", "16", "8", "16", "16", "16r", "16", "8", "8", "8"]
    let placedNotes = document.querySelectorAll('.placed');
    let placedPhrase = [];
    placedNotes.forEach(note => {
        placedPhrase.push(note.getAttribute('vf-duration'));
    })
    if (arrayEquals(triggerPhrase, placedPhrase) || arrayEquals(triggerPhrase2, placedPhrase)) {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", '_blank').focus();
    }
    if (arrayEquals(triggerPhrase3, placedPhrase) || arrayEquals(triggerPhrase4, placedPhrase)){
        window.open("https://www.youtube.com/watch?v=YkADj0TPrJA&t=196s", '_blank').focus();
    }
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }