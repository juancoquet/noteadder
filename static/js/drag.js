const draggables = document.querySelectorAll('.draggable');
const bar = document.querySelector('.bar-container');
const bin = document.querySelector('.bin');

// Bar listeners
bar.addEventListener('dragover', dragOver);
bar.addEventListener('dragenter', dragEnter);
bar.addEventListener('dragleave', dragLeave);
bar.addEventListener('drop', dragDrop);

// Draggables listeners
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
    draggable.addEventListener('dragend', dragEnd);
})

// Bin listeners
bin.addEventListener('dragover', dragOverBin);
bin.addEventListener('dragenter', dragEnterBin);
bin.addEventListener('dragleave', dragLeaveBin);
bin.addEventListener('drop', binDrop);


// Bar drag functions

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
}

function dragDrop(e) {
    const beingDragged = document.querySelector('.dragging');

    if(!beingDragged.classList.contains('placed')) {
        // replace used block
        const parent = beingDragged.parentElement;
        const replacement = beingDragged.cloneNode(true);
        replacement.classList.remove('dragging');
        if (!beingDragged.classList.contains('rest')) {
            parent.insertBefore(replacement, parent.firstChild);
        } else {   
            parent.appendChild(replacement);
        }
        replacement.addEventListener('dragstart', dragStart);
        replacement.addEventListener('dragend', dragEnd);

        // update remaining bar value
        let barVal = parseFloat(bar.getAttribute('value'))
        const subtractVal = parseFloat(beingDragged.getAttribute('value'))
        barVal -= subtractVal
        bar.setAttribute('value', barVal)
    }
    
    beingDragged.classList.add('placed')
    const followingElement = getDropPosition(this, e.clientX);
    if (followingElement == null) {
            bar.appendChild(beingDragged)
    } else {
        bar.insertBefore(beingDragged, followingElement)
    }

    // TODO: calculate allowed notes. Maybe helper function
    calculateAllowedNotes();
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


// Draggable drag functions

function dragStart() {
    this.classList.add('dragging');
}

function dragEnd() {
    this.classList.remove('dragging');
}


// Function to get drop position
function getDropPosition(bar, mouseX) {
    const placedElements = [...bar.querySelectorAll('.placed:not(.dragging)')];
    
    return placedElements.reduce((followingElement, child) => {
        const childBoundaries = child.getBoundingClientRect()
        const offset = mouseX - childBoundaries.left - (childBoundaries.width / 2)
        if (offset < 0 && offset > followingElement.offset) {
            return {offset: offset, element: child} 
        } else {
            return followingElement
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}


// Bin drag functions

function dragOverBin(e) {
    e.preventDefault();
    this.style.transform = 'scale(1.025)'
}

function dragEnterBin(e) {
    e.preventDefault();
    this.style.transform = 'scale(1.025)'
}

function dragLeaveBin() {
    this.style.transform = 'scale(1)'
}

function binDrop() {
    const beingDragged = document.querySelector('.dragging');
    if (beingDragged.classList.contains('placed')) {
        let barVal = parseFloat(bar.getAttribute('value'))
        const noteVal = parseFloat(beingDragged.getAttribute('value'))
        barVal += noteVal
        bar.setAttribute('value', barVal)
        beingDragged.remove();
        calculateAllowedNotes();
    }
    this.style.transform = 'scale(1)'
}

