function generateCircleSignal(p, N, radius) {
    let signalX = [];
    let signalY = [];
    
    for(let i = 0; i < N; i++) {
        let angle = p.map(i, 0, N, 0, p.TWO_PI);
        signalX[i] = radius * p.cos(angle);
        signalY[i] = radius * p.sin(angle);
    }
    
    return { signalX, signalY };
}

function generateRoseSignal(p, N, k, radius) {
    let signalX = [];
    let signalY = [];
    
    for (let i = 0; i < N; i++) {
        let angle = p.map(i, 0, N, 0, p.TWO_PI);
        let r = radius * p.cos(k * angle);
        
        signalX[i] = r * p.cos(angle);
        signalY[i] = r * p.sin(angle);
    }
    
    return { signalX, signalY };
}


function generateButterflySignal(p, N, radius) {
    let signalX = [];
    let signalY = [];
    
    for (let i = 0; i < N; i++) {
        let t = p.map(i, 0, N, 0, 12 * Math.PI); // Note: 12 * PI for full detail
        let r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5);
        
        signalX[i] = radius * Math.sin(t) * r;
        signalY[i] = -radius * Math.cos(t) * r; 
    }
    
    return { signalX, signalY };
}

function generatePiSignal(p, N, size) {
    let signalX = [];
    let signalY = [];
    
    // Outline vertices for a block Pi
    const vertices = [
        {x: -1, y: -1}, {x: 1, y: -1}, {x: 1, y: -0.7}, {x: 0.4, y: -0.7}, 
        {x: 0.4, y: 1}, {x: 0.1, y: 1}, {x: 0.1, y: -0.7}, {x: -0.1, y: -0.7}, 
        {x: -0.1, y: 1}, {x: -0.4, y: 1}, {x: -0.4, y: -0.7}, {x: -1, y: -0.7}
    ];

    for (let i = 0; i < N; i++) {
        let percent = (i / N) * vertices.length;
        let index = Math.floor(percent);
        let nextIndex = (index + 1) % vertices.length;
        let lerpFactor = percent - index;

        let start = vertices[index];
        let end = vertices[nextIndex];

        // Linear interpolation between vertices
        signalX[i] = p.lerp(start.x, end.x, lerpFactor) * size;
        signalY[i] = p.lerp(start.y, end.y, lerpFactor) * size;
    }
    
    return { signalX, signalY };
}

function generatePi(p, N, scale) {
    let signalX = [];
    let signalY = [];

    // Balanced vertices with a thin left hook
    const vertices = [
        {x: -70, y: -40}, {x: 70, y: -40},   // Top bar (Top)
        {x: 70, y: -30},                     // Top bar (Right edge)
        {x: 30, y: -30},                     // Under bar (Right)
        {x: 30, y: 60},                      // Right leg (Outer)
        {x: 40, y: 65}, {x: 20, y: 65},      // Right foot serif
        {x: 15, y: 60}, {x: 15, y: -30},     // Right leg (Inner) - Width is 15
        {x: -15, y: -30},                    // Middle gap
        {x: -15, y: 30},                     // Left leg (Inner)
        {x: -25, y: 60}, {x: -45, y: 65},    // Left hook (Bottom)
        {x: -55, y: 50}, {x: -30, y: 20},    // Left hook (Curving back)
        {x: -30, y: -30},                    // Left leg (Outer) - Width is 15
        {x: -70, y: -30},                    // Under bar (Left)
        {x: -70, y: -40}                     // Back to start
    ];

    for (let i = 0; i < N; i++) {
        let percent = (i / N) * (vertices.length - 1);
        let index = Math.floor(percent);
        let nextIndex = (index + 1) % vertices.length;
        let lerpFactor = percent - index;

        // Using p.lerp to ensure points are distributed evenly
        // This prevents the "jumping" or "shaking" of circles
        signalX[i] = p.lerp(vertices[index].x, vertices[nextIndex].x, lerpFactor) * (scale / 100);
        signalY[i] = p.lerp(vertices[index].y, vertices[nextIndex].y, lerpFactor) * (scale / 100);
    }

    return { signalX, signalY };
}

function generateHeartSignal(p, N, scale) {
    let signalX = [];
    let signalY = [];

    for (let i = 0; i < N; i++) {
        let t = p.map(i, 0, N, 0, p.TWO_PI);

        // Classic heart curve; y is flipped because the canvas y axis points down
        signalX[i] = scale * 16 * Math.pow(Math.sin(t), 3);
        signalY[i] = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    }

    return { signalX, signalY };
}

// Turn a hand-drawn stroke into N evenly spaced points. The stroke is closed
// with a straight line back to its start (the Fourier transform treats the
// shape as a loop), centred on its middle, and shrunk if it's larger than
// maxHalfSize in either direction.
function generateFreehandSignal(points, N, maxHalfSize) {
    const closed = [...points, points[0]];

    // Cumulative distance along the stroke
    const dist = [0];
    for (let i = 1; i < closed.length; i++) {
        dist[i] = dist[i - 1] + Math.hypot(closed[i].x - closed[i - 1].x, closed[i].y - closed[i - 1].y);
    }
    const total = dist[dist.length - 1];

    // Sample N points at equal distances along it
    const sampled = [];
    let seg = 1;
    for (let i = 0; i < N; i++) {
        const target = (i / N) * total;
        while (seg < closed.length - 1 && dist[seg] < target) seg++;
        const span = dist[seg] - dist[seg - 1] || 1;
        const t = (target - dist[seg - 1]) / span;
        sampled.push({
            x: closed[seg - 1].x + (closed[seg].x - closed[seg - 1].x) * t,
            y: closed[seg - 1].y + (closed[seg].y - closed[seg - 1].y) * t,
        });
    }

    // Centre on the middle of its bounding box, and fit the size
    const xs = sampled.map((pt) => pt.x);
    const ys = sampled.map((pt) => pt.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const half = Math.max(Math.max(...xs) - cx, Math.max(...ys) - cy, 1);
    const scale = Math.min(1, maxHalfSize / half);

    return {
        signalX: sampled.map((pt) => (pt.x - cx) * scale),
        signalY: sampled.map((pt) => (pt.y - cy) * scale),
    };
}

// Shapes offered in the Fourier Transformation Arts picker.
// To add one: write a generator above, then add an entry here.
const DRAW_SHAPES = [
    { value: 'pi', label: 'π', generate: (p) => generatePi(p, 300, 200) },
    { value: 'heart', label: 'Heart', generate: (p) => generateHeartSignal(p, 300, 10) },
    { value: 'rose', label: 'Rose', generate: (p) => generateRoseSignal(p, 500, 4, 150) },
    { value: 'butterfly', label: 'Butterfly', generate: (p) => generateButterflySignal(p, 300, 50) },
    { value: 'circle', label: 'Circle', generate: (p) => generateCircleSignal(p, 300, 120) },
    // Uses the stroke drawn on the canvas (see the freehand handlers)
    { value: 'freehand', label: '✏️ Draw', generate: null },
];
