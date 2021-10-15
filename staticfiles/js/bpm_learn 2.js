const bpmSlider = document.querySelector('.bpm-slider');
const bpmValue = document.querySelector('.bpm-value--learn');

bpmSlider.setAttribute('value', 120);

bpmSlider.addEventListener('input', updateValue);
bpmSlider.addEventListener('input', updateTempo);
bpmSlider.addEventListener('input', fillSlider);
bpmSlider.addEventListener('touchmove', touchSlider);

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
    console.log('run');
    let sliderWidth = bpmSlider.offsetWidth;
    let valueWidth = bpmValue.offsetWidth;
    let sliderBounds = bpmSlider.getBoundingClientRect();
    let min = parseInt(bpmSlider.getAttribute('min'));
    let max = parseInt(bpmSlider.getAttribute('max'));
    let range = max - min;
    let value = parseInt(bpmSlider.value);
    let dif = value - min;
    let percent = dif / range;
    let position = (sliderWidth * percent) - (valueWidth / 2) + sliderBounds.left;

    if (position + valueWidth > sliderBounds.right) {
        bpmValue.style.left = sliderBounds.right - valueWidth + 'px';
    } else if (position < sliderBounds.left) {
        bpmValue.style.left = sliderBounds.left + 'px';
    } else {
        bpmValue.style.left = position + 'px';
    }
}

function touchSlider(e) {
    let sliderLeft = bpmSlider.getBoundingClientRect().left;
    let x = e.targetTouches[0].pageX - sliderLeft;
    let percent = x / bpmSlider.offsetWidth;
    let min = parseInt(bpmSlider.getAttribute('min'));
    let max = parseInt(bpmSlider.getAttribute('max'));
    let toAdd = Math.round((max - min) * percent);
    let newVal = min + toAdd;
    bpmSlider.value = newVal;
    updateValue();
    updateTempo();
    fillSlider();
    positionValue();
}

const tocMetronome = document.querySelector('#toc-metronome');

tocMetronome.addEventListener('click', positionValue);

const contBtns = document.querySelectorAll('.btn--continue');
const prevBtns = document.querySelectorAll('.btn--previous');

contBtns.forEach(btn => {
    btn.addEventListener('click', positionValue);
})

prevBtns.forEach(btn => {
    btn.addEventListener('click', positionValue);
})