// Square Wave Fourier Series Visualization
let squareWaveState = {
    TIME: 0,
    WAVE: []
};

function setupSquareWave(p) {
    p.createCanvas(800, 600);
    p.background(0);
}

function drawSquareWave(p) {
    // Draw the background
    p.background(0);
    
    // Translate to the center of the canvas
    p.translate(170, 300);
    
    let X = 0;
    let Y = 0;

    // For square wave -> 4 * RADIUS * sin(n*TIME) / (n*PI) | n = 1, 3, 5, 7, 9, ...
    for (let i = 0; i < 10; i++) {

        let N = 2*i + 1;
        let RADIUS = 4 * 70 / (N * Math.PI);

        let prevX = X;
        let prevY = Y;
        
        X += RADIUS * p.cos(N * squareWaveState.TIME);
        Y += RADIUS * p.sin(N * squareWaveState.TIME);


        // Draw the circle
        p.stroke(255, 100);
        p.noFill();
        p.ellipse(prevX, prevY, RADIUS * 2);

        // Draw the line from center of the circle to the point
        p.stroke(255);
        p.line(prevX, prevY, X, Y);

        // Update the previous X and Y values
        prevX = X;
        prevY = Y;
    }

    // Add the Y value to draw the wave
    squareWaveState.WAVE.unshift(Y);

    // Draw the wave
    p.translate(200, 0);

    // Draw the line from circle point to wave point
    p.stroke(255);
    p.line(X - 200, Y, 0, squareWaveState.WAVE[0]);

    // Draw the wave
    p.beginShape();
    p.noFill();
    // Loop through the WAVE array to draw the history of the wave
    for(let i = 0; i < squareWaveState.WAVE.length; i++) {
        p.vertex(i, squareWaveState.WAVE[i]);
    }
    p.endShape();

    squareWaveState.TIME += 0.05;

    if(squareWaveState.WAVE.length > 370) {
        squareWaveState.WAVE.pop();
    }
}

function resetSquareWave() {
    squareWaveState.TIME = 0;
    squareWaveState.WAVE = [];
}
