const bar = document.querySelector('.bar-container')

window.addEventListener('DOMContentLoaded', setupDraggables);
window.addEventListener('dragend', setupDraggables);

function setupDraggables() {
    const draggables = document.querySelectorAll('.draggable')
    draggables.forEach(draggable => {
        const parent = draggable.parentElement
        const replacement = draggable.cloneNode(true)

        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })
}

bar.addEventListener('dragover', e => {
    e.preventDefault()
    const followingElement = getDropPosition(bar, e.clientX)
    const beingDragged = document.querySelector('.dragging')
    if (followingElement == null) {
        bar.appendChild(beingDragged)
    } else {
        bar.insertBefore(beingDragged, followingElement)
    }
    beingDragged.classList.add('placed')
})

function getDropPosition(bar, mouseX) {
    const placedElements = [...bar.querySelectorAll('.placed:not(.dragging)')]

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