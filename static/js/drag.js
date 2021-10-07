const bar = document.querySelector('.bar-container');
const bin = document.querySelector('.bin');

let clientX, clientY;
let pageX, pageY;

document.addEventListener('dragover', setXY);
document.addEventListener('touchmove', setXY);

function setXY(e) {
    e.preventDefault();
    if(e.type == 'dragover') {
        clientX = e.clientX;
        clientY = e.clientY;
        pageX = e.pageX;
        pageY = e.pageY;
    } else {
        let touchLocation = e.targetTouches[0];
        clientX = touchLocation.clientX;
        clientY = touchLocation.clientY;
        pageX = touchLocation.pageX;
        pageY = touchLocation.pageY;
    }
}



// Draggables listeners
const draggables = document.querySelectorAll('.draggable');
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
    draggable.addEventListener('drag', drag);
    draggable.addEventListener('dragend', dragEnd);
    
    draggable.addEventListener('touchstart', dragStart);
    draggable.addEventListener('touchmove', drag);
    draggable.addEventListener('touchend', dragEnd);

    draggable.addEventListener('contextmenu', disableContextMenu);
})

// Draggable drag functions

function dragStart(e) {
    if(e.type == 'dragstart') {
        // // replace drag ghost with transparent image
        let img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        e.dataTransfer.setDragImage(img, window.outerWidth, window.outerHeight);
        pageX = e.pageX;
        pageY = e.pageY;
    } else {
        let touchLocation = e.targetTouches[0];
        pageX = touchLocation.pageX;
        pageY = touchLocation.pageY;
    }
    
    let width = this.offsetWidth;
    let height = this.offsetHeight;
    this.style.width = width + 'px';
    // let noteVal = parseFloat(this.getAttribute('value'));
    // let barVal = parseFloat(bar.getAttribute('absolute-value'));
    // let percentageWidth = (noteVal / barVal * 100) * 100 + '%';
    
    if (!this.classList.contains('placed')){
        let replacement = this.cloneNode(true);
        
        replacement.addEventListener('dragstart', dragStart);
        replacement.addEventListener('drag', drag);
        replacement.addEventListener('dragend', dragEnd);
        replacement.addEventListener('touchstart', dragStart);
        replacement.addEventListener('touchmove', drag);
        replacement.addEventListener('touchend', dragEnd);
        replacement.addEventListener('contextmenu', disableContextMenu, false);

        this.parentElement.appendChild(replacement);
        resizeBlockToPercentage(replacement);
    }
    this.style.left = pageX - (width/2) + 'px';
    this.style.top = pageY - (height/2) + 'px';
    this.style.position = 'absolute';
    this.classList.add('dragging');
}

function drag(e) {
    let beingDragged = document.querySelector('.dragging');
    let width = beingDragged.offsetWidth;
    let height = beingDragged.offsetHeight;
    beingDragged.style.left = pageX - (width/2) + 'px';
    beingDragged.style.top = pageY - (height/2) + 'px';
}

function dragEnd(e) {
    let beingDragged = document.querySelector('.dragging');
    let barBounds = bar.getBoundingClientRect();
    
    if (clientX < barBounds.left || clientX > barBounds.right || clientY < barBounds.top || clientY > barBounds.bottom) {
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
        resizeBlockToPercentage(beingDragged);
    }
    calculateBarValue();
    calculateAllowedNotes();
    calculatePlayEnabled();
}


// utility ------------------------------------------------------------------------

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
    if (clientX > barBounds.left && clientX < midPoints[0]) {
        appendBefore = placedElements[0];
    }

    for (i=0; i<midPoints.length-1; i++) {
        if (clientX > midPoints[i] && clientX < midPoints[i+1]) {
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

            block.removeEventListener('touchstart', dragStart);
            block.removeEventListener('touchmove', drag);
            block.removeEventListener('touchend', dragEnd);
        } else {
            block.setAttribute('draggable', true);
            block.classList.add('draggable');
            block.classList.remove('surplus');

            block.addEventListener('touchstart', dragStart);
            block.addEventListener('touchmove', drag);
            block.addEventListener('touchend', dragEnd);
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

function disableContextMenu(e) {
    e.preventDefault();
    clientX = e.clientX;
    clientY = e.clientY;
    dragEnd();
}

function resizeBlockToPercentage(block) {
    let barVal = parseFloat(bar.getAttribute('absolute-value'));
    let noteVal = parseFloat(block.getAttribute('value'));
    let percentageWidth = noteVal / barVal * 100 + '%';
    block.style.width = percentageWidth;
}