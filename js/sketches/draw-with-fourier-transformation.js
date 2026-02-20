// Draw with Fourier Transformation Visualization
let drawFourierState = {
    SIGNAL: [],
    TIME: 0,
    WAVE: [],
    numCircles: 10,
    paused: false,
    speed: 0.05,
    fourierY: []
};

function setupDrawWithFourierTransformation(p) {
    p.createCanvas(1200, 700);
    p.background(0);

    drawFourierState.SIGNAL = [100,100,-100,-100,-100,-100,100,100,100,100,-100,-100,-100,-100,100,100];
    // drawFourierState.fourierY = dft(drawFourierState.SIGNAL);

    // Create UI controls
    createDrawFourierControls(drawFourierState);
}

function drawDrawWithFourierTransformation(p) {
    // Draw the background
    p.background(0);
    
    // Translate to the center of the canvas
    p.translate(350, 350);
    
    let X = 0;
    let Y = 0;

    // For square wave -> 4 * RADIUS * sin(n*TIME) / (n*PI) | n = 1, 3, 5, 7, 9, ...
    for (let i = 0; i < drawFourierState.numCircles; i++) {


        let prevX = X;
        let prevY = Y;

        let N = 2*i + 1;
        let RADIUS = 4 * 100 / (N * Math.PI);
        
        X += RADIUS * p.cos(N * drawFourierState.TIME);
        Y += RADIUS * p.sin(N * drawFourierState.TIME);


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

    // Draw the wave section
    p.translate(200, 0);

    // Draw the line from circle point to wave point (only if wave has points)
    if (drawFourierState.WAVE.length > 0) {
        p.stroke(255);
        p.line(X - 200, Y, 0, drawFourierState.WAVE[0]);

        // Draw the wave history
        p.beginShape();
        p.noFill();
        // Loop through the WAVE array to draw the history of the wave
        for(let i = 0; i < drawFourierState.WAVE.length; i++) {
            p.vertex(i, drawFourierState.WAVE[i]);
        }
        p.endShape();
    }

    // Only add new wave points and increment TIME if not paused
    if (!drawFourierState.paused) {
        drawFourierState.WAVE.unshift(Y);
        drawFourierState.TIME += drawFourierState.speed;
    }
    
    // Limit wave history length
    if (drawFourierState.WAVE.length > 400) {
        drawFourierState.WAVE.pop();
    }
}

function resetDrawWithFourierTransformation() {
    drawFourierState.TIME = 0;
    drawFourierState.SIGNAL = [];
    drawFourierState.WAVE = [];
    drawFourierState.fourierY = [];
    drawFourierState.numCircles = 10;
    drawFourierState.paused = false;
    drawFourierState.speed = 0.05;
}