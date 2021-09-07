const playButton = document.querySelector('.play');

playButton.addEventListener('click', metronome);


const click = new Tone.Sampler({
    urls: {
        "C5": "static/js/playback/sounds/metronome-up.wav",
        "C4": "static/js/playback/sounds/metronome.wav",
    },
    release: 1,
}).toDestination();

const metronomeNotes = ['C5', 'C4', 'C4', 'C4'];
let beat = 0;

function metronome () {
    console.log('playing');
    let now = Tone.now();
    console.log(now);

    Tone.Transport.scheduleRepeat(time => {
        let note = metronomeNotes[beat % metronomeNotes.length];
        click.triggerAttackRelease(note, '4n', time);
        beat++;
    }, '4n', startTime=now, duration='2m');

    Tone.Transport.start();
};