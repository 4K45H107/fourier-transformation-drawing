function setupSingleEpicycleMode(p, state, signals) {

    const N = Math.min(signals.signalX.length, signals.signalY.length);
    let complexSignal = [];
    
    for (let i = 0; i < N; i++) {
        complexSignal[i] = new Complex(signals.signalX[i], signals.signalY[i]);
    }
    
    state.SIGNAL = complexSignal;

    state.fourier = DFT_Complex(complexSignal);
    state.fourier = state.fourier.sort((a, b) => b.amp - a.amp);
}

function drawSingleEpicycleMode(p, state) {
    p.background(0);
    
    const centerX = p.width / 2;
    const centerY = p.height / 2;
    
    let X = centerX;
    let Y = centerY;
    const N = state.fourier.length;

    // Draw epicycle chain
    for (let i = 0; i < N; i++) {
        let prevX = X;
        let prevY = Y;

        let FREQ = state.fourier[i].freq;
        let RADIUS = state.fourier[i].amp;
        let PHASE = state.fourier[i].phase;

        X += RADIUS * p.cos(FREQ * state.TIME + PHASE);
        Y += RADIUS * p.sin(FREQ * state.TIME + PHASE);

        p.stroke(255, 100);
        p.noFill();
        p.ellipse(prevX, prevY, RADIUS * 2);

        p.stroke(255);
        p.line(prevX, prevY, X, Y);

        prevX = X;
        prevY = Y;
    }

    let finalPos = p.createVector(X, Y);

    if (state.PATH.length > 0) {
        p.stroke(255);
     
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
        
        const N = state.SIGNAL.length; 
        const dt = p.TWO_PI / N;
        state.TIME += dt;
    }
    
    if (state.TIME >= p.TWO_PI) {
        state.TIME = 0;
        state.PATH = [];
    }
}