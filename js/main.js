// Main Router - Handles navigation between sketches
let currentSketch = null;
let currentSketchName = null;

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
        reset: resetDrawWithFourierTransformation
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
        };
        
        p.draw = function() {
            sketch.draw(p);
        };
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
