const bar = document.querySelector('.bar-container');
const bin = document.querySelector('.bin');

let mouseX, mouseY;

document.addEventListener('dragover', setXY)

function setXY(e) {
    e.preventDefault();
    mouseX = e.pageX;
    mouseY = e.pageY;
}




// Draggables listeners
const draggables = document.querySelectorAll('.draggable');
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
    draggable.addEventListener('drag', drag);
    draggable.addEventListener('dragend', dragEnd);
})

// Draggable drag functions

function dragStart(e) {
    // // replace drag ghost with transparent image
    let img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    e.dataTransfer.setDragImage(img, window.outerWidth, window.outerHeight);
    let width = this.offsetWidth;
    let height = this.offsetHeight;

    if (!this.classList.contains('placed')){
        let clone = this.cloneNode(true);
        clone.addEventListener('dragstart', dragStart);
        clone.addEventListener('drag', drag);
        clone.addEventListener('dragend', dragEnd);
        clone.classList.add('dragging');
        clone.style.width = width + 'px';
        clone.style.position = 'absolute';
        this.parentElement.appendChild(clone);
        clone.style.left = e.clientX - (width/2) + 'px';
        clone.style.top = e.clientY - (height/2) + 'px';
    } else {
        this.classList.add('dragging');
        this.style.position = 'absolute';
        this.style.left = e.clientX - (width/2) + 'px';
        this.style.top = e.clientY - (height/2) + 'px';
    }
}

function drag(e) {
    let beingDragged = document.querySelector('.dragging');
    let width = beingDragged.offsetWidth;
    let height = beingDragged.offsetHeight;
    beingDragged.style.left = mouseX - (width/2) + 'px';
    beingDragged.style.top = mouseY - (height/2) + 'px';
}

function dragEnd(e) {
    let beingDragged = document.querySelector('.dragging');
    let barBounds = bar.getBoundingClientRect();
    
    if (mouseX < barBounds.left || mouseX > barBounds.right || mouseY < barBounds.top || mouseY > barBounds.bottom) {
        beingDragged.remove();
    } else {
        let appendBefore = getAppendBefore();
        if (appendBefore) {
            bar.insertBefore(beingDragged, appendBefore);
        } else {
            bar.appendChild(beingDragged);
        }
        beingDragged.style.position = 'static';
        beingDragged.classList.add('placed');
        beingDragged.classList.remove('dragging');
    }
    calculateBarValue();
    calculateAllowedNotes();
    calculatePlayEnabled();
}


// Function to return note block to append before on drop
function getAppendBefore() {
    let placedElements = [...bar.querySelectorAll('.placed:not(.dragging)')];
    let midPoints = [];
    placedElements.forEach(el => {
        let box = el.getBoundingClientRect();
        let midPoint = (box.left + box.right) / 2;
        midPoints.push(midPoint);
    })
    let appendBefore;

    let barBounds = bar.getBoundingClientRect();
    if (mouseX > barBounds.left && mouseX < midPoints[0]) {
        appendBefore = placedElements[0];
    }

    for (i=0; i<midPoints.length-1; i++) {
        if (mouseX > midPoints[i] && mouseX < midPoints[i+1]) {
            appendBefore = placedElements[i+1];
            { break };
        }
    }
    return appendBefore;
}

function calculateAllowedNotes() {
    const noteBlocks = document.querySelectorAll('.note-block:not(.placed)');
    noteBlocks.forEach(block => {
        const noteValue = parseFloat(block.getAttribute('value'));
        const barValue = parseFloat(bar.getAttribute('value'));
        if (noteValue > barValue) {
            block.setAttribute('draggable', false);
            block.classList.remove('draggable');
            block.classList.add('surplus');
        } else {
            block.setAttribute('draggable', true);
            block.classList.add('draggable');
            block.classList.remove('surplus');
        }
    })
}

function calculateBarValue() {
    let absVal = parseFloat(bar.getAttribute('absolute-value'));
    let value = absVal;
    let placedNotes = document.querySelectorAll('.placed');
    placedNotes.forEach(note => {
        value = value - parseFloat(note.getAttribute('value'));
    })
    bar.setAttribute('value', value);
}

function calculatePlayEnabled() {
    let playButton = document.querySelector('.play');
    let barVal = parseFloat(bar.getAttribute('value'));
    if (barVal === 0) {
        playButton.classList.add('play--active');
    } else {
        playButton.classList.remove('play--active');
    }
}