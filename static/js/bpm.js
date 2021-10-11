const bpmSlider = document.querySelector('.bpm-slider');
const bpmValue = document.querySelector('.bpm-value');

bpmSlider.setAttribute('value', 120);

bpmSlider.addEventListener('input', updateValue);
bpmSlider.addEventListener('input', updateTempo);
bpmSlider.addEventListener('input', fillSlider);
document.addEventListener('DOMContentLoaded', positionValue);
document.addEventListener('input', positionValue);
window.addEventListener('resize', positionValue);


function updateValue() {
    bpmValue.innerHTML = bpmSlider.value + ' BPM';
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

function positionValue() {
    let sliderWidth = bpmSlider.offsetWidth;
    let valueWidth = bpmValue.offsetWidth;
    let parent = bpmValue.parentElement;
    let min = parseInt(bpmSlider.getAttribute('min'));
    let max = parseInt(bpmSlider.getAttribute('max'));
    let range = max - min;
    let value = parseInt(bpmSlider.value);
    let dif = value - min;
    let percent = dif / range;
    let padding = parseFloat(getComputedStyle(bpmValue.parentNode).paddingLeft.replace('px', ''));
    let position = (sliderWidth * percent) - (valueWidth / 2) + padding;

    let rightLimit = parent.offsetWidth - padding - valueWidth - 4;

    if (position > rightLimit) {
        bpmValue.style.left = rightLimit + 'px';
    } else if (position < padding) {
        bpmValue.style.left = padding + 'px';
    } else {
        bpmValue.style.left = position + 'px';
    }
}