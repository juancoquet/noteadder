const bar = document.querySelector('.bar-container')

window.addEventListener('DOMContentLoaded', setupDraggables);
window.addEventListener('dragend', setupDraggables);

function setupDraggables() {
    const draggables = document.querySelectorAll('.draggable')
    draggables.forEach(draggable => {

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

    beingDragged.addEventListener('dragend', () => {
        beingDragged.classList.remove('dragging')
        parent = beingDragged.parentElement

        if (followingElement == null) {
            bar.appendChild(beingDragged)
        } else {
            bar.insertBefore(beingDragged, followingElement)
        }

        if (!beingDragged.classList.contains('placed') && parent.classList.contains('note-group')) {
            const replacement = beingDragged.cloneNode(true)
            if (!beingDragged.classList.contains('rest')) {
                parent.insertBefore(replacement, parent.firstChild)
            } else {   
                parent.appendChild(replacement)
            }
        }

        beingDragged.classList.add('placed')
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
                beingDragged.remove()
            } else {
                console.log('inside')
            }
        }
    })
})

// window.addEventListener('mousemove', e => {
//     const x = e.clientX
//     const y = e.clientY
//     const bar = document.querySelector('.bar-container')
//     const barBoundaries = bar.getBoundingClientRect()

//     if (x < barBoundaries.left || x > barBoundaries.right
//         || y < barBoundaries.top || y > barBoundaries.bottom) {
//             console.log('outside')
//         } else {
//             console.log('inside')
//         }
// })