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
