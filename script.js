function loadImage(file) {
    const image = document.getElementById('SourceImage');
    image.src = URL.createObjectURL(file);
    image.addEventListener('load', () => {
        init()
    })
}

// handle paste of image
document.addEventListener('DOMContentLoaded', () => {
    document.onpaste = function(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file') {
                loadImage(item.getAsFile())
            }
        }
    }
});


// handle drag and drop of image
function dropHandler(ev) {
    ev.preventDefault();
    loadImage(ev.dataTransfer.files[0])
}

function dragOverHandler(ev) {
    ev.preventDefault();
}



const dropArea = document.querySelector(".container"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");

let file;
var filename;

// clicks DOM input element
button.onclick = () => {
    input.click()
};

// on file select
input.addEventListener("change", function(event) {
    loadImage(event.target.files[0])
});

var canvas;
var context;

async function loadFile(event) {
    loadImage(event.target.files[0])
};


async function init() {
    const image = document.getElementById('SourceImage');
    canvas = document.getElementById('Canvas');
    context = canvas.getContext('2d');

    // Set the canvas the same width and height of the image
    canvas.width = image.width;
    canvas.height = image.height;

    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    distortCanvasImage(imageData.data);
    effectAddNoise(imageData.data);
    effectColorCurve(imageData.data);
    context.putImageData(imageData, 0, 0);

    // calculate image aspact ratio
    var aspectRatio = canvas.width / canvas.height;

    // calculate html document aspect ratio
    var documentAspectRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;



    if (aspectRatio < documentAspectRatio) {
        canvas.style.height = "90vh";
    } else {
        canvas.style.width = "95vw";
    }


    // remove card-picker class from class element
    document.querySelector('.card').classList.remove('card-picker');

    document.getElementById("upload-text").style.display = "none";
    document.getElementById("canvas-container").style.display = "block";

}


function distortCanvasImage(data) {

    function setPixel(x, y, data, rgba) {
        var index = (x + y * canvas.width) * 4;
        data[index + 0] = rgba[0];
        data[index + 1] = rgba[1];
        data[index + 2] = rgba[2];
        data[index + 3] = rgba[3];
    }

    function getPixel(x, y, data) {
        var index = (x + y * canvas.width) * 4;
        return [data[index + 0], data[index + 1], data[index + 2], data[index + 3]];
    }

    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {

            const frequency = 0.1;
            const amplitude = 2;
            let offset = Math.round((Math.round(amplitude * Math.sin(x * frequency)) + amplitude) * 0.3);
            let offsetY = Math.round((Math.round(amplitude * Math.sin(y * frequency)) + amplitude) * 0.3);

            var pixel = getPixel(x, y + offset, data);
            setPixel(x, y, data, pixel);
        }
    }
}

function effectAddNoise(data) {
    const strength = 40
    for (var i = 0; i < data.length; i += 4) {
        data[i + 0] = data[i + 0] + Math.random() * strength;
        data[i + 1] = data[i + 1] + Math.random() * strength;
        data[i + 2] = data[i + 2] + Math.random() * strength;
    }
}

function effectColorCurve(data) {

    function curveFunction(x) {
        return x * 0.8 + 0.2 * Math.pow(x - 1, 2) - 0.2
    }

    for (var i = 0; i < data.length; i += 4) {
        const avgBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const normalized = avgBrightness / 255;
        const curve = curveFunction(normalized);
        const newBrightness = curve * 255;

        const difference = newBrightness / avgBrightness;

        // apply difference to current pixel
        data[i + 0] *= difference * 0.95;
        data[i + 1] *= difference * 1;
        data[i + 2] *= difference * 0.9;
    }
}


// window.addEventListener('load', init);
const overlay = document.getElementById('overlay')
document.getElementById('help-on').addEventListener('click', () => overlay.style.display = "block")
document.getElementById('overlay').addEventListener('click', () => overlay.style.display = "none")