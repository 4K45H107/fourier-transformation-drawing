// Draw with Fourier Transformation Visualization
let drawFourierState = {
    SIGNAL: [],
    fourierY: [],
    WAVE: [],
    TIME: 0,
    paused: false,
    speed: 1,
};

function setupDrawWithFourierTransformation(p) {
    p.createCanvas(1200, 700);
    p.background(0);

    for(let i = 0; i < 250; i++) {
        drawFourierState.SIGNAL[i] = i;
    }
    drawFourierState.fourierY = DFT(drawFourierState.SIGNAL);

    // Create UI controls
    createDrawFourierControls(drawFourierState);
}

function drawDrawWithFourierTransformation(p) {
    p.background(0);
    p.translate(350, 350);
    
    let X = 0;
    let Y = 0;
    const N = drawFourierState.SIGNAL.length;

    for (let i = 0; i < N; i++) {

        let prevX = X;
        let prevY = Y;

        let FREQ = drawFourierState.fourierY[i].freq;
        let RADIUS = drawFourierState.fourierY[i].amp;
        let PHASE = drawFourierState.fourierY[i].phase;

        X += RADIUS * p.cos(FREQ * drawFourierState.TIME + PHASE + Math.PI/2);
        Y += RADIUS * p.sin(FREQ * drawFourierState.TIME + PHASE + Math.PI/2);

        p.stroke(255, 100);
        p.noFill();
        p.ellipse(prevX, prevY, RADIUS * 2);

        p.stroke(255);
        p.line(prevX, prevY, X, Y);

        // Update the previous X and Y values
        prevX = X;
        prevY = Y;
    }

    p.translate(200, 0);

    if (drawFourierState.WAVE.length > 0) {
        p.stroke(255);
        p.line(X - 200, Y, 0, drawFourierState.WAVE[0]);

        p.beginShape();
        p.noFill();
        for(let i = 0; i < drawFourierState.WAVE.length; i++) {
            p.vertex(i, drawFourierState.WAVE[i]);
        }
        p.endShape();
    }

    if (!drawFourierState.paused) {
        drawFourierState.WAVE.unshift(Y);
        const dt = 2 * Math.PI / N;
        drawFourierState.TIME += dt * drawFourierState.speed;
    }
    
    if (drawFourierState.WAVE.length > 400) {
        drawFourierState.WAVE.pop();
    }
}

function resetDrawWithFourierTransformation() {
    drawFourierState.TIME = 0;
    drawFourierState.SIGNAL = [];
    drawFourierState.WAVE = [];
    drawFourierState.fourierY = [];
    drawFourierState.paused = false;
    drawFourierState.speed = 1;
}