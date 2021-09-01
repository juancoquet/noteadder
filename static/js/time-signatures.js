const timeSigs = document.querySelectorAll('.time-signature');

timeSigs.forEach(button => {
    button.addEventListener('click', timeSigPress);
})


// Time signature button functions

function timeSigPress() {
    const oldSig = document.querySelector('.pressed');
    oldSig.classList.remove('pressed');
    this.classList.add('pressed');
}