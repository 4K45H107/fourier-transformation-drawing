let drawFourierState = {
    SIGNAL_X: [],
    SIGNAL_Y: [],
    fourierX: [],
    fourierY: [],
    PATH: [],
    TIME: 0,
    paused: false,
    speed: 1,
};

function setupDrawWithFourierTransformation(p) {
    p.createCanvas(1200, 700);
    p.background(0);

    for(let i = 0; i < 100; i++) {
        let angle = p.map(i, 0, 100, 0, p.TWO_PI);
        drawFourierState.SIGNAL_X[i] = 100 * p.cos(angle) ;
    }

    for(let i = 0; i < 100; i++) {
        let angle = p.map(i, 0, 100, 0, p.TWO_PI);
        drawFourierState.SIGNAL_Y[i] = 100 * p.sin(angle) ;
    }

    drawFourierState.fourierX = DFT(drawFourierState.SIGNAL_X);
    drawFourierState.fourierY = DFT(drawFourierState.SIGNAL_Y);
  
    createDrawFourierControls(drawFourierState);
}

function epicycles(p, startX, startY, rotation, fourier) {

    let X = startX;
    let Y = startY;
    const N = fourier.length;

    for (let i = 0; i < N; i++) {

        let prevX = X;
        let prevY = Y;

        let FREQ = fourier[i].freq;
        let RADIUS = fourier[i].amp;
        let PHASE = fourier[i].phase;

        X += RADIUS * p.cos(FREQ * drawFourierState.TIME + PHASE + rotation);
        Y += RADIUS * p.sin(FREQ * drawFourierState.TIME + PHASE + rotation);

        p.stroke(255, 100);
        p.noFill();
        p.ellipse(prevX, prevY, RADIUS * 2);

        p.stroke(255);
        p.line(prevX, prevY, X, Y);

        prevX = X;
        prevY = Y;
    }

    return p.createVector(X, Y);
}

function drawDrawWithFourierTransformation(p) {
    p.background(0);
    
    const posX = epicycles(p, 800, 150, 0, drawFourierState.fourierX);
    const posY = epicycles(p, 200, 450, p.HALF_PI, drawFourierState.fourierY);

    let finalPos = p.createVector(posX.x, posY.y);

    if (drawFourierState.PATH.length > 0) {
        
        p.stroke(255);

        p.line(posX.x, posX.y, finalPos.x, finalPos.y);
        p.line(posY.x, posY.y, finalPos.x, finalPos.y);

        p.line(finalPos.x, finalPos.y, drawFourierState.PATH[0].x, drawFourierState.PATH[0].y);

        p.beginShape();
        p.noFill();
        for(let i = 0; i < drawFourierState.PATH.length; i++) {
            p.vertex(drawFourierState.PATH[i].x, drawFourierState.PATH[i].y);
        }
        p.endShape();
    }

    if (!drawFourierState.paused) {

        drawFourierState.PATH.unshift(finalPos);
        
        const N = drawFourierState.SIGNAL_X.length; 
        const dt = p.TWO_PI / N;
        
        drawFourierState.TIME += dt;
    }
    
    if (drawFourierState.TIME >= p.TWO_PI) {
        drawFourierState.TIME = 0;
        drawFourierState.PATH = [];
    }
}

function resetDrawWithFourierTransformation() {
    drawFourierState.TIME = 0;
    drawFourierState.PATH = [];
    drawFourierState.paused = false;
}