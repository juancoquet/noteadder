const continueButtons = document.querySelectorAll('.btn--continue');
const prevButtons = document.querySelectorAll('.btn--previous');
const tocItems = document.querySelectorAll('.toc__item');

continueButtons.forEach(btn => {
    btn.addEventListener('click', eighthNotesMarkerHeights);
});
prevButtons.forEach(btn => {
    btn.addEventListener('click', eighthNotesMarkerHeights);
});
tocItems.forEach(item => {
    item.addEventListener('click', eighthNotesMarkerHeights);
})


// counting examples ------------------------------------------------

const billieJeanPlayer = new Tone.Player("../static/js/playback/sounds/billie-jean-counting.mp3").toDestination();
const gravityPlayer = new Tone.Player("../static/js/playback/sounds/gravity-counting.mp3").toDestination();

const bjPlayBtn = document.getElementById("play-bj");
bjPlayBtn.addEventListener('click', playBJ);

const gravityPlayBtn = document.getElementById("play-gravity");
gravityPlayBtn.addEventListener('click', playGravity);


function playBJ() {
    billieJeanPlayer.start(Tone.now());
}

function playGravity() {
    gravityPlayer.start(Tone.now());
}


// note playback ----------------------------------------------------

const sixteenthNoteMixPlayBtn = document.getElementById('play-sixteenth-note-mix');
const restPlayBtn = document.getElementById('play-rest');
sixteenthNoteMixPlayBtn.addEventListener('click', playSixteenthNoteMix);
restPlayBtn.addEventListener('click', playRest);

const synth = new Tone.Synth();
synth.envelope.attack = 0.001;
synth.envelope.release = 0.01;

const gain = new Tone.Gain(0.3).toDestination();
synth.connect(gain);


// eighth note mix example ---------------------------------------------------------------------------

const eighthNoteMixPlayBtn = document.getElementById('play-eighth-note-mix');
eighthNoteMixPlayBtn.addEventListener('click', playEighthNoteMix);
eighthNoteMixPlayBtn.addEventListener('click', showEightNoteMarker);
eighthNoteMixPlayBtn.addEventListener('click', animateEighthNoteBarMarker);

function playEighthNoteMix() {
    let notes = ['4n', '4n', '8n', '8n', '8n', '8n'];
    let now = Tone.now()
    let startTimes = [now, ]
    
    let i = 0;
    for (let note of notes) {
        if (i == notes.length - 1) {break};
        let duration = Tone.Time(note).toSeconds();
        let nextStart = startTimes[i] + duration;
        startTimes.push(nextStart);
        i++
    }

    for (let i=0; i < notes.length; i++) {
        synth.triggerAttackRelease('E4', notes[i], startTimes[i]);
    }
}

function eighthNotesMarkerHeights() {
    window.scrollTo(0, 0);
    // notation marker
    let section = document.getElementById('eighth_notes');
    let notation = document.getElementById('notation-eighth_note_mix');
    let marker = section.querySelector('.playback-marker--notation');
    let barline = notation.getElementsByTagName('path')[0];
    let staveTop = barline.getBoundingClientRect().top;
    let markerHeight = marker.getBoundingClientRect().height;
    let difference = markerHeight - 44;
    marker.style.top = staveTop - (difference/2) + 'px';

    // bar marker
    marker = section.querySelector('.playback-marker--bar');
    let example = section.querySelector('#eighth-notes-example');
    let barBoundaries = example.getBoundingClientRect();
    let barTop = barBoundaries.top;
    let barHeight = barBoundaries.height;
    markerHeight = marker.getBoundingClientRect().height;
    difference = markerHeight - barHeight;
    marker.style.top = barTop - (difference/2) + 'px';
}

async function showEightNoteMarker() {
    let section = document.getElementById('eighth_notes');
    let playButton = section.querySelector('.play');
    playButton.classList.remove('play--active');
    let marker = section.querySelector('.playback-marker--notation');
    let notation = document.getElementById('notation-eighth_note_mix');
    let drawnNotes = notation.querySelectorAll('.vf-note');
    let notePositions = [];
    drawnNotes.forEach(note => {
        let boundaries = note.getBoundingClientRect();
        notePositions.push(boundaries.left);
    })
    
    let sleepVals = [0, 0.5, 0.5, 0.25, 0.25, 0.25];
    
    marker.style.opacity = 1;
    for (let i = 0; i < sleepVals.length; i++) {
        await sleep(sleepVals[i]);
        marker.style.left = notePositions[i] - 4 + 'px';
    }
    await sleep(0.25);
    resetEighthNoteMarker()
    playButton.classList.add('play--active');
}

async function animateEighthNoteBarMarker() {
    let barDuration = 2
    let section = document.getElementById('eighth_notes');
    let marker = section.querySelector('.playback-marker--bar');
    marker.style.opacity = 1;
    let bar = section.querySelector('#eighth-notes-example');
    let barBoundaries = bar.getBoundingClientRect();
    marker.style.transition = `${barDuration}s linear`;
    marker.style.transform = `translateX(${barBoundaries.width}px)`;
    await sleep(barDuration);
    marker.style.transition = '0s';
    
    // reset
    marker.style.opacity = 0;
    marker.style.transform = 'none';
}

function resetEighthNoteMarker() {
    let section = document.getElementById('eighth_notes');
    let notation = document.getElementById('notation-eighth_note_mix');
    let marker = section.querySelector('.playback-marker--notation');
    let barline = notation.getElementsByTagName('path')[0];
    marker.style.opacity = 0;
    marker.style.left = barline.getBoundingClientRect().left + 'px';
}


// sixteenth note mix example ------------------------------------------------------------------------

function playSixteenthNoteMix() {
    let notes = ['4n', '8n', '8n', '16n', '16n', '16n', '16n', '16n', '16n', '16n', '16n'];
    let now = Tone.now()
    let startTimes = [now, ]
    
    let i = 0;
    for (let note of notes) {
        if (i == notes.length - 1) {break};
        let duration = Tone.Time(note).toSeconds();
        let nextStart = startTimes[i] + duration;
        startTimes.push(nextStart);
        i++
    }

    for (let i=0; i < notes.length; i++) {
        synth.triggerAttackRelease('E4', notes[i], startTimes[i]);
    }
}


// rest example ----------------------------------------------------------------------------------------

function playRest() {
    let notes = ['4n', '4n', '4n', '4n'];
    let velocities = [1, 1, 0, 1]
    let now = Tone.now()
    let startTimes = [now, ]
    
    let i = 0;
    for (let note of notes) {
        if (i == notes.length - 1) {break};
        let duration = Tone.Time(note).toSeconds();
        let nextStart = startTimes[i] + duration;
        startTimes.push(nextStart);
        i++
    }

    for (let i=0; i < notes.length; i++) {
        synth.triggerAttackRelease('E4', notes[i], startTimes[i], velocities[i]);
    }
}


// utility ---------------------------------------------------------------------------------------------

function sleep(s) {
    let ms = s * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
    // call await sleep(s); inside an async fucntion to use.
}