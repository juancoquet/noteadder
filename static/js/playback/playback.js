const playButton = document.querySelector('.play');

playButton.addEventListener('click', playMetronome);


const click = new Tone.Sampler({
    urls: {
        "C5": "static/js/playback/sounds/metronome-up.wav",
        "C4": "static/js/playback/sounds/metronome.wav",
    },
    release: 1,
}).toDestination();

function playMetronome () {
    let timeSig = document.querySelector('.time-signature.pressed');
    let bottom = parseInt(timeSig.getAttribute('bottom'));
    let now = Tone.now() - 1.5;

    let beat = 0;
    Tone.Transport.scheduleRepeat(time => {
        console.log('done');
        let note = metronomeNotes[beat % metronomeNotes.length];
        click.triggerAttackRelease(note, '4n', time);
        beat++;
    }, bottom + 'n', startTime=now, duration='2m');

    Tone.Transport.start();
};