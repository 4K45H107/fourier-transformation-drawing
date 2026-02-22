function drawEpicycleChain(p, startX, startY, rotation, fourier, time) {
    let X = startX;
    let Y = startY;
    const N = fourier.length;

    for (let i = 0; i < N; i++) {
        let prevX = X;
        let prevY = Y;

        let FREQ = fourier[i].freq;
        let RADIUS = fourier[i].amp;
        let PHASE = fourier[i].phase;

        X += RADIUS * p.cos(FREQ * time + PHASE + rotation);
        Y += RADIUS * p.sin(FREQ * time + PHASE + rotation);

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

function setupDualEpicycleMode(p, state, signals) {
    state.SIGNAL_X = signals.signalX;
    state.SIGNAL_Y = signals.signalY;

    state.fourierX = DFT(state.SIGNAL_X);
    state.fourierY = DFT(state.SIGNAL_Y);

    // Sort by amplitude (largest first)
    state.fourierX = state.fourierX.sort((a, b) => b.amp - a.amp);
    state.fourierY = state.fourierY.sort((a, b) => b.amp - a.amp);
}

function drawDualEpicycleMode(p, state) {
    p.background(0);
    
    const posX = drawEpicycleChain(p, 800, 150, 0, state.fourierX, state.TIME);
    const posY = drawEpicycleChain(p, 200, 450, p.HALF_PI, state.fourierY, state.TIME);

    let finalPos = p.createVector(posX.x, posY.y);

    if (state.PATH.length > 0) {
        p.stroke(255);

        p.line(posX.x, posX.y, finalPos.x, finalPos.y);
        p.line(posY.x, posY.y, finalPos.x, finalPos.y);
        
        p.line(finalPos.x, finalPos.y, state.PATH[0].x, state.PATH[0].y);

        // Draw the path
        p.beginShape();
        p.noFill();
        for(let i = 0; i < state.PATH.length; i++) {
            p.vertex(state.PATH[i].x, state.PATH[i].y);
        }
        p.endShape();
    }

    if (!state.paused) {

        state.PATH.unshift(finalPos);
        
        const N = state.SIGNAL_X.length; 
        const dt = p.TWO_PI / N;
        state.TIME += dt;
    }
    
    if (state.TIME >= p.TWO_PI) {
        state.TIME = 0;
        state.PATH = [];
    }
}
