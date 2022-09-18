var file
var filename
var canvas
var context

const dropArea = document.querySelector(".container")
const button = dropArea.querySelector("button")
const input = dropArea.querySelector("input")

async function main() {
    const image = document.getElementById('SourceImage')
    canvas = document.getElementById('Canvas')
    context = canvas.getContext('2d')

    canvas.width = image.width
    canvas.height = image.height

    context.drawImage(image, 0, 0)

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height)

    // apply filters loaded from filter.js file
    global_canvas_filters.forEach(filter => filter(imageData.data))

    context.putImageData(imageData, 0, 0)


    var imageAspectRatio = canvas.width / canvas.height
    var documentAspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight

    if (imageAspectRatio < documentAspectRatio) {
        canvas.style.height = "90vh"
    } else {
        canvas.style.width = "95vw"
    }


    document.querySelector('.card').classList.remove('card-picker')
    document.getElementById("upload-text").style.display = "none"
    document.getElementById("canvas-container").style.display = "block"
    document.getElementById("back-on").style.display = "block"
}


function loadImage(file) {
    const image = document.getElementById('SourceImage')
    image.src = URL.createObjectURL(file)
    image.addEventListener('load', () => {
        main()
    })
}

// ----------------- PASTE FROM CLIPBOARD -----------------
document.addEventListener('DOMContentLoaded', () => {
    document.onpaste = function(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items
        for (let index in items) {
            if (items[index].kind === 'file') loadImage(items[index].getAsFile())
        }
    }
})


// ----------------- DRAG AND DROP -----------------
function dropHandler(ev) {
    ev.preventDefault()
    loadImage(ev.dataTransfer.files[0])
}

function dragOverHandler(ev) {
    ev.preventDefault()
}

// ----------------- CHOOSE FILE BUTTON -----------------
// clicks DOM input element
button.onclick = () => {
    input.click()
}

// on file select
input.addEventListener("change", function(event) {
    loadImage(event.target.files[0])
})

// help button overlay
const overlay = document.getElementById('overlay')
document.getElementById('help-on').addEventListener('click', () => overlay.style.display = "block")
document.getElementById('overlay').addEventListener('click', () => overlay.style.display = "none")