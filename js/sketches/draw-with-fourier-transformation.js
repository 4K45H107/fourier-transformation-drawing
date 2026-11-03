let drawFourierState = {
    mode: 'single',
    shape: 'pi',
    SIGNAL: [],
    SIGNAL_X: [],
    SIGNAL_Y: [],
    fourier: [],
    fourierX: [],
    fourierY: [],
    PATH: [],
    TIME: 0,
    paused: false,
    speed: 1,
    p5Instance: null, // Store p5 instance for reinitialization
};

function initializeDrawFourierMode(p) {

    // Reset state
    drawFourierState.TIME = 0;
    drawFourierState.PATH = [];
    drawFourierState.SIGNAL = [];
    drawFourierState.SIGNAL_X = [];
    drawFourierState.SIGNAL_Y = [];
    drawFourierState.fourier = [];
    drawFourierState.fourierX = [];
    drawFourierState.fourierY = [];

    // Generate the selected shape's signal
    const shape = DRAW_SHAPES.find((s) => s.value === drawFourierState.shape) || DRAW_SHAPES[0];
    let signals = shape.generate(p);
    
    if (drawFourierState.mode === 'dual') {
        setupDualEpicycleMode(p, drawFourierState, signals);
    }
    else if (drawFourierState.mode === 'single') {
        setupSingleEpicycleMode(p, drawFourierState, signals);
    }
}

function setupDrawWithFourierTransformation(p) {
    p.createCanvas(1200, 700);
    drawFourierState.p5Instance = p;
    
    initializeDrawFourierMode(p);
    createDrawFourierControls(drawFourierState);
}

function reinitializeDrawFourierMode() {
    if (drawFourierState.p5Instance) {
        initializeDrawFourierMode(drawFourierState.p5Instance);
    }
}

function drawDrawWithFourierTransformation(p) {
    if (drawFourierState.mode === 'dual') {
        drawDualEpicycleMode(p, drawFourierState);
    }
    else if (drawFourierState.mode === 'single') {
        drawSingleEpicycleMode(p, drawFourierState);
    }
}

function resetDrawWithFourierTransformation() {
    drawFourierState.TIME = 0;
    drawFourierState.PATH = [];
    drawFourierState.paused = false;
}