var global_canvas_filters = [effectDistortWave, effectAddNoise, effectColorCurve];

function effectDistortWave(data) {

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