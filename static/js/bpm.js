const bpmSlider = document.querySelector('.bpm-slider');
const bpmValue = document.querySelector('.bpm-value');

bpmSlider.setAttribute('value', 120);

bpmSlider.addEventListener('input', updateValue);
bpmSlider.addEventListener('input', updateTempo);
bpmSlider.addEventListener('input', fillSlider);


function updateValue() {
    bpmValue.innerHTML = bpmSlider.value;
}

function updateTempo() {
    Tone.Transport.bpm.value = parseInt(bpmSlider.value);
}

function fillSlider() {
    let min = parseInt(bpmSlider.getAttribute('min'));
    let max = parseInt(bpmSlider.getAttribute('max'));
    let range = max - min;
    let value = parseInt(bpmSlider.value);
    let dif = value - min;
    let percent = dif / range * 100 + '%';
    bpmSlider.style.background = 'linear-gradient(90deg, var(--col-blush)' + percent + ', var(--col-bg)' + percent + ')';
}