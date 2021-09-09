let qtrNote = document.querySelector('.quarter-note:not(.rest):not(.placed)');
let copy = qtrNote.cloneNode(deep=true);
let bar = document.querySelector('.bar-container');
bar.appendChild(copy);
copy.classList.add('placed');