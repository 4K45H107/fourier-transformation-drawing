// Main Router - Handles navigation between sketches
let currentSketch = null;
let currentSketchName = null;

// Sketches draw in a fixed 1200x700 space; the canvas is scaled to fit the
// screen (never larger than this), and pointer input is scaled back.
const CANVAS_W = 1200;
const CANVAS_H = 700;
const LAYOUT_GAP = 16;

// Fit now, and again once the browser has settled the page size: mobile
// browsers can report an in-between size while loading or rotating
function scheduleFit(p) {
    fitCanvas(p);
    requestAnimationFrame(() => requestAnimationFrame(() => fitCanvas(p)));
}

// Pointer position in sketch coordinates
function sketchPointer(p) {
    const scale = p.fitScale || 1;
    return { x: p.mouseX / scale, y: p.mouseY / scale };
}

// Size the canvas to the screen, and place the side panel (if any) beside
// or below it, whichever leaves the bigger canvas.
function fitCanvas(p) {
    const container = document.getElementById('sketch-container');
    const panel = document.getElementById('draw-fourier-mode-controls');
    const topBar = document.getElementById('draw-fourier-controls')
        || document.getElementById('square-wave-controls');
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const top = (topBar ? topBar.getBoundingClientRect().bottom : 0) + LAYOUT_GAP;
    const fit = (w, h) => Math.max(0.1, Math.min(w / CANVAS_W, h / CANVAS_H, 1));

    let scale = fit(vw - 2 * LAYOUT_GAP, vh - top - LAYOUT_GAP);
    let bottom = LAYOUT_GAP;

    if (panel) {
        panel.classList.remove('layout-below');
        panel.classList.add('layout-beside');
        // Beside only works if the whole panel fits the screen height
        const besideScale = panel.offsetHeight <= vh - 2 * LAYOUT_GAP
            ? fit(vw - 2 * (panel.offsetWidth + 2 * LAYOUT_GAP), vh - top - LAYOUT_GAP)
            : 0;

        panel.classList.replace('layout-beside', 'layout-below');
        const panelHeight = panel.offsetHeight;
        const belowScale = fit(vw - 2 * LAYOUT_GAP, vh - top - panelHeight - 2 * LAYOUT_GAP);

        if (besideScale >= belowScale) {
            panel.classList.replace('layout-below', 'layout-beside');
            scale = besideScale;
        } else {
            scale = belowScale;
            bottom = panelHeight + 2 * LAYOUT_GAP;
        }
    }

    p.fitScale = scale;
    const width = Math.round(CANVAS_W * scale);
    p.resizeCanvas(width, Math.round(CANVAS_H * scale));
    container.style.paddingTop = `${top}px`;
    container.style.paddingBottom = `${bottom}px`;
    document.documentElement.style.setProperty('--canvas-half-width', `${width / 2}px`);
}

// Sketch registry
const sketches = {
    'square-wave': {
        setup: setupSquareWave,
        draw: drawSquareWave,
        reset: resetSquareWave
    },
    'draw-fourier': {
        setup: setupDrawWithFourierTransformation,
        draw: drawDrawWithFourierTransformation,
        reset: resetDrawWithFourierTransformation,
        mousePressed: (p) => freehandPointerDown(p),
        mouseDragged: (p) => freehandPointerMove(p),
        mouseReleased: (p) => freehandPointerUp(p),
        // Touch: same handlers; returning false stops the page scrolling
        touchStarted: (p) => !freehandPointerDown(p),
        touchMoved: (p) => !freehandPointerMove(p),
        touchEnded: (p) => !freehandPointerUp(p)
    }
};

// Cleanup helper function
function cleanupSketch() {
    if (!currentSketch) return;
    
    // Remove all controls
    const squareWaveControls = document.getElementById('square-wave-controls');
    if (squareWaveControls) squareWaveControls.remove();
    
    const drawFourierControls = document.getElementById('draw-fourier-controls');
    if (drawFourierControls) drawFourierControls.remove();
    
    const drawFourierModeControls = document.getElementById('draw-fourier-mode-controls');
    if (drawFourierModeControls) drawFourierModeControls.remove();
    
    // Reset state
    if (sketches[currentSketchName]?.reset) {
        sketches[currentSketchName].reset();
    }
    
    // Remove p5 instance and clear container
    currentSketch.remove();
    currentSketch = null;
    
    const container = document.getElementById('sketch-container');
    container.innerHTML = '';
    
    // Reset container styles
    container.removeAttribute('style');
}

function showMenu() {
    document.body.classList.remove('sketch-page');
    document.getElementById('menu-container').style.display = 'block';
    document.getElementById('sketch-container').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    
    cleanupSketch();
    currentSketchName = null;
}

function showSketch(sketchName) {
    if (!sketches[sketchName]) {
        console.error(`Sketch "${sketchName}" not found`);
        showMenu();
        return;
    }

    // Clean up previous sketch
    cleanupSketch();
    
    // Reset styles to prevent layout issues
    document.body.classList.add('sketch-page');
    document.body.style.height = '';
    document.body.style.minHeight = '';
    document.body.style.maxHeight = '';
    document.documentElement.style.height = '';
    document.documentElement.style.minHeight = '';
    document.documentElement.style.maxHeight = '';
    
    // Setup container
    const container = document.getElementById('sketch-container');
    container.style.height = '';
    container.style.minHeight = '';
    container.style.maxHeight = '';
    container.style.width = '';
    container.style.display = 'block';
    
    document.getElementById('menu-container').style.display = 'none';
    document.getElementById('back-btn').style.display = 'block';
    
    // Initialize new sketch
    currentSketchName = sketchName;
    const sketch = sketches[sketchName];
    
    currentSketch = new p5(function(p) {
        p.setup = function() {
            sketch.setup(p);
            scheduleFit(p);
        };
        
        p.draw = function() {
            p.scale(p.fitScale || 1);
            sketch.draw(p);
        };

        p.windowResized = function() {
            scheduleFit(p);
        };

        // Optional pointer handlers, for sketches that take mouse/touch input
        ['mousePressed', 'mouseDragged', 'mouseReleased',
         'touchStarted', 'touchMoved', 'touchEnded'].forEach((event) => {
            if (sketch[event]) {
                p[event] = (e) => sketch[event](p, e);
            }
        });
    }, 'sketch-container');
}

function handleRoute() {
    const hash = window.location.hash.slice(1); // Remove #
    
    if (hash && sketches[hash]) {
        showSketch(hash);
    } else {
        showMenu();
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);

// Phone rotation (some browsers fire this without a usable resize)
window.addEventListener('orientationchange', () => {
    if (currentSketch) scheduleFit(currentSketch);
});

// Handle initial load - wait for p5.js to load
window.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for p5.js to be available
    setTimeout(() => {
        handleRoute();
    }, 100);
});

// Export for menu.js
window.router = {
    navigateTo: showSketch,
    showMenu: showMenu
};
