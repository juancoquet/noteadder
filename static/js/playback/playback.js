const playButton = document.querySelector('.play');

playButton.addEventListener('click', playMetronome);
playButton.addEventListener('click', playNotes);


// Metronome playback 

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
    for (let note of metronomeNotes) {
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



// Note playback

const synth = new Tone.Synth();
synth.envelope.attack = 0.001;
synth.envelope.release = 0.01;

const gain = new Tone.Gain(0.3).toDestination();
synth.connect(gain);

function playNotes() {
    let placed = document.querySelectorAll('.placed');
    let notes = [];
    let velocities = [];
    placed.forEach(noteBlock => {
        notes.push(noteBlock.getAttribute('tonejs-duration'));
        velocities.push(+! noteBlock.classList.contains('rest')); // +! turns t=>0, f=>1
    })
    let now = Tone.now()
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
    
    for (let i = 0; i < notes.length; i++) {
        synth.triggerAttackRelease('C4', notes[i], startTimes[i], velocities[i]);
      }
}