// Square Wave Fourier Series Visualization
let squareWaveState = {
    TIME: 0,
    WAVE: [],
    numCircles: 10,  // Number of circles (N)
    paused: false,   // Pause state
    speed: 0.05      // Speed of animation (TIME increment per frame)
};

function setupSquareWave(p) {
    p.createCanvas(1200, 700);
    p.background(0);
    
    // Create UI controls
    createSquareWaveControls(squareWaveState);
}

function drawSquareWave(p) {
    // Draw the background
    p.background(0);
    
    // Translate to the center of the canvas
    p.translate(350, 350);
    
    let X = 0;
    let Y = 0;

    // For square wave -> 4 * RADIUS * sin(n*TIME) / (n*PI) | n = 1, 3, 5, 7, 9, ...
    for (let i = 0; i < squareWaveState.numCircles; i++) {

        let N = 2*i + 1;
        let RADIUS = 4 * 100 / (N * Math.PI);

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

    // Draw the wave section
    p.translate(200, 0);

    // Draw the line from circle point to wave point (only if wave has points)
    if (squareWaveState.WAVE.length > 0) {
        p.stroke(255);
        p.line(X - 200, Y, 0, squareWaveState.WAVE[0]);

        // Draw the wave history
        p.beginShape();
        p.noFill();
        // Loop through the WAVE array to draw the history of the wave
        for(let i = 0; i < squareWaveState.WAVE.length; i++) {
            p.vertex(i, squareWaveState.WAVE[i]);
        }
        p.endShape();
    }

    // Only add new wave points and increment TIME if not paused
    if (!squareWaveState.paused) {
 
        squareWaveState.WAVE.unshift(Y);
        squareWaveState.TIME += squareWaveState.speed;
        
        if(squareWaveState.WAVE.length > 400) {
            squareWaveState.WAVE.pop();
        }
    }

    if(squareWaveState.WAVE.length > 400) {
        squareWaveState.WAVE.pop();
    }
}

function resetSquareWave() {
    squareWaveState.TIME = 0;
    squareWaveState.WAVE = [];
    squareWaveState.numCircles = 10; // Reset to default
    squareWaveState.paused = false; // Reset pause state
    squareWaveState.speed = 0.05; // Reset speed to default
    removeSquareWaveControls();
}
