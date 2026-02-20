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

function showMenu() {
    document.body.classList.remove('sketch-page');
    document.getElementById('menu-container').style.display = 'block';
    document.getElementById('sketch-container').style.display = 'none';
    document.getElementById('back-btn').style.display = 'none';
    
    // Clean up current sketch
    if (currentSketch) {
        if (sketches[currentSketchName] && sketches[currentSketchName].reset) {
            sketches[currentSketchName].reset();
        }
        currentSketch.remove();
        currentSketch = null;
        currentSketchName = null;
    }
}

function showSketch(sketchName) {
    if (!sketches[sketchName]) {
        console.error(`Sketch "${sketchName}" not found`);
        showMenu();
        return;
    }

    document.body.classList.add('sketch-page');
    document.getElementById('menu-container').style.display = 'none';
    document.getElementById('sketch-container').style.display = 'block';
    document.getElementById('back-btn').style.display = 'block';
    
    // Clean up previous sketch
    if (currentSketch) {
        if (sketches[currentSketchName] && sketches[currentSketchName].reset) {
            sketches[currentSketchName].reset();
        }
        currentSketch.remove();
        // Clean up any sketch-specific UI controls
        const existingControls = document.getElementById('square-wave-controls');
        if (existingControls) {
            existingControls.remove();
        }
    }
    
    // Initialize new sketch
    currentSketchName = sketchName;
    const sketch = sketches[sketchName];
    
    // Create new p5 instance in instance mode
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
