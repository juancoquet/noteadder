
window.addEventListener('DOMContentLoaded', setupDraggables);
window.addEventListener('dragend', setupDraggables);

function setupDraggables() {
    const draggables = document.querySelectorAll('.draggable')
    draggables.forEach(draggable => {

        const bar = document.querySelector('.bar-container')
        
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
    })
}

window.addEventListener('dragover', e => {
    const beingDragged = document.querySelector('.dragging')
    beingDragged.addEventListener('dragend', () => {
        const bar = document.querySelector('.bar-container')
        const barBoundaries = bar.getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY
        
        if (x < barBoundaries.left || x > barBoundaries.right
            || y < barBoundaries.top || y > barBoundaries.bottom) {
                if (beingDragged.classList.contains('placed')) {
                    console.log('remove')
                    beingDragged.remove()
                }
            }
    })
})
    
    
const bar = document.querySelector('.bar-container')
bar.addEventListener('dragover', e => {
    e.preventDefault()
    const followingElement = getDropPosition(bar, e.clientX)
    const beingDragged = document.querySelector('.dragging')

    beingDragged.addEventListener('dragend', dragend => {
        beingDragged.classList.remove('dragging')
        parent = beingDragged.parentElement

        if (followingElement == null) {
            bar.appendChild(beingDragged)
        } else {
            bar.insertBefore(beingDragged, followingElement)
        }

        let previousVal = parseFloat(bar.getAttribute('value'))
        let newVal = previousVal - parseFloat(beingDragged.getAttribute('value'))
        bar.setAttribute('value', newVal)
        console.log(previousVal, parseFloat(beingDragged.getAttribute('value')), newVal)

        if (!beingDragged.classList.contains('placed') && parent.classList.contains('note-group')) {
            const replacement = beingDragged.cloneNode(true)
            if (!beingDragged.classList.contains('rest')) {
                parent.insertBefore(replacement, parent.firstChild)
            } else {   
                parent.appendChild(replacement)
            }
        }

        beingDragged.classList.add('placed')
        // dragend.stopImmediatePropagation()
    })
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
