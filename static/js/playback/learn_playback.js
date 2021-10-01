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

const eighthNoteMixPlayBtn = document.getElementById('play-eighth-note-mix');
const sixteenthNoteMixPlayBtn = document.getElementById('play-sixteenth-note-mix');
const restPlayBtn = document.getElementById('play-rest');
eighthNoteMixPlayBtn.addEventListener('click', playEighthNoteMix);
sixteenthNoteMixPlayBtn.addEventListener('click', playSixteenthNoteMix);
restPlayBtn.addEventListener('click', playRest);

const synth = new Tone.Synth();
synth.envelope.attack = 0.001;
synth.envelope.release = 0.01;

const gain = new Tone.Gain(0.3).toDestination();
synth.connect(gain);


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