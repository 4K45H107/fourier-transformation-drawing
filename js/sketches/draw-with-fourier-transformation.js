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
    stepBudget: 0, // fractional steps carried between frames (for slow speeds)
    p5Instance: null, // Store p5 instance for reinitialization
};

function initializeDrawFourierMode(p) {

    // Reset state
    drawFourierState.TIME = 0;
    drawFourierState.stepBudget = 0;
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

// Speed presets for the drawing (multiples of the normal pace)
const DRAW_SPEEDS = [0.25, 0.5, 1, 2, 4];

// Advance the drawing at the current speed, always in whole sample steps:
// the DFT reproduces the shape exactly only at the sample points, and in
// between its high frequencies swing wildly. So 4x takes 4 steps per frame
// (recording the pen at each, so the line keeps its detail), and 0.25x
// takes one step every 4th frame.
function advanceDrawing(p, state, N, penAt) {
    const dt = p.TWO_PI / N;
    state.stepBudget = (state.stepBudget || 0) + state.speed;
    const steps = Math.floor(state.stepBudget);
    state.stepBudget -= steps;

    for (let s = 0; s < steps; s++) {
        state.PATH.unshift(penAt(state.TIME));
        state.TIME += dt;

        // One full turn draws the whole shape; then start over
        if (state.TIME >= p.TWO_PI) {
            state.TIME = 0;
            state.PATH = [];
            return;
        }
    }
}
