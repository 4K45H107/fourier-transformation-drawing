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