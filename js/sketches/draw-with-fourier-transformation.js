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
    // Freehand: 'waiting' for a drawing, 'drawing' it, or 'playing' it back
    freehand: { phase: 'waiting', stroke: [], points: null, hint: '' },
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
    let signals;
    if (drawFourierState.shape === 'freehand') {
        const freehand = drawFourierState.freehand;
        if (!freehand.points) {
            freehand.phase = 'waiting';
            return; // nothing to play until something is drawn
        }
        freehand.phase = 'playing';
        // Dual mode has less room: its chains run along the top and left
        const maxHalfSize = drawFourierState.mode === 'dual' ? 200 : 300;
        signals = generateFreehandSignal(freehand.points, FREEHAND_SAMPLES, maxHalfSize);
    } else {
        const shape = DRAW_SHAPES.find((s) => s.value === drawFourierState.shape) || DRAW_SHAPES[0];
        signals = shape.generate(p);
    }
    
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
    if (drawFourierState.shape === 'freehand' && drawFourierState.freehand.phase !== 'playing') {
        drawFreehandCanvas(p);
        return;
    }

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

// ── Freehand drawing ─────────────────────────────────────────────────────

const FREEHAND_SAMPLES = 400;   // points the drawing is resampled to
const FREEHAND_MIN_POINTS = 10; // anything shorter counts as a click
const FREEHAND_MIN_LENGTH = 80; // pixels of stroke needed

function freehandActive() {
    return drawFourierState.shape === 'freehand';
}

function insideCanvas(p) {
    return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
}

// Clear the canvas and wait for a new drawing
function startNewFreehandDrawing() {
    const freehand = drawFourierState.freehand;
    freehand.phase = 'waiting';
    freehand.stroke = [];
    freehand.points = null;
    freehand.hint = '';
    drawFourierState.TIME = 0;
    drawFourierState.PATH = [];
}

// Each handler returns true when it used the event (so touch can stop
// the page from scrolling while drawing).
function freehandPointerDown(p) {
    if (!freehandActive() || !insideCanvas(p)) return false;
    const freehand = drawFourierState.freehand;
    freehand.phase = 'drawing';
    freehand.stroke = [{ x: p.mouseX, y: p.mouseY }];
    freehand.points = null;
    freehand.hint = '';
    return true;
}

function freehandPointerMove(p) {
    const freehand = drawFourierState.freehand;
    if (!freehandActive() || freehand.phase !== 'drawing') return false;
    const x = p.constrain(p.mouseX, 0, p.width);
    const y = p.constrain(p.mouseY, 0, p.height);
    const last = freehand.stroke[freehand.stroke.length - 1];
    if (Math.hypot(x - last.x, y - last.y) >= 2) {
        freehand.stroke.push({ x, y });
    }
    return true;
}

function freehandPointerUp(p) {
    const freehand = drawFourierState.freehand;
    if (!freehandActive() || freehand.phase !== 'drawing') return false;

    const stroke = freehand.stroke;
    let length = 0;
    for (let i = 1; i < stroke.length; i++) {
        length += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
    }

    if (stroke.length < FREEHAND_MIN_POINTS || length < FREEHAND_MIN_LENGTH) {
        startNewFreehandDrawing();
        freehand.hint = 'Too small. Try a bigger shape.';
        return true;
    }

    freehand.points = stroke;
    initializeDrawFourierMode(p); // runs the DFT and switches to playing
    return true;
}

// The canvas before playback: instructions and the stroke being drawn
function drawFreehandCanvas(p) {
    const freehand = drawFourierState.freehand;
    p.background(0);

    if (freehand.stroke.length > 1) {
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();
        p.beginShape();
        for (const pt of freehand.stroke) p.vertex(pt.x, pt.y);
        p.endShape();
        p.strokeWeight(1);
    }

    if (freehand.phase === 'waiting') {
        p.noStroke();
        p.fill(255, 170);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(22);
        p.text('Draw a shape', p.width / 2, p.height / 2 - 18);
        p.fill(255, 110);
        p.textSize(15);
        p.text(freehand.hint || 'Release to watch the epicycles redraw it', p.width / 2, p.height / 2 + 16);
    }
}
