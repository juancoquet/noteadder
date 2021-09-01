const draggables = document.querySelectorAll('.draggable');
const bar = document.querySelector('.bar-container');

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
    const followingElement = getDropPosition(this, e.clientX);
    if (followingElement == null) {
            bar.appendChild(beingDragged)
    } else {
        bar.insertBefore(beingDragged, followingElement)
    }
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
        console.log('called')
        console.log(child)
        const childBoundaries = child.getBoundingClientRect()
        const offset = mouseX - childBoundaries.left - (childBoundaries.width / 2)
        if (offset < 0 && offset > followingElement.offset) {
            return {offset: offset, element: child} 
        } else {
            return followingElement
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}

