const bpmSlider = document.querySelector('.bpm-slider');
const bpmValue = document.querySelector('.bpm-value');

bpmSlider.setAttribute('value', 120);

bpmSlider.addEventListener('input', updateValue);
bpmSlider.addEventListener('input', updateTempo);


function updateValue() {
    bpmValue.innerHTML = bpmSlider.value;
}

function updateTempo() {
    Tone.Transport.bpm.value = parseInt(bpmSlider.value);
}