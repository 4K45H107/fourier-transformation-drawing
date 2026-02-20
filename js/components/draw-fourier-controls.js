// Draw Fourier Controls Component
// Handles all UI controls for the draw with Fourier transformation visualization

/**
 * Creates the controls panel for draw Fourier visualization
 * @param {Object} state - The draw Fourier state object
 * @returns {HTMLElement} The controls container element
 */
function createDrawFourierControls(state) {
    // Remove existing controls if any
    const existing = document.getElementById('draw-fourier-controls');
    if (existing) {
        existing.remove();
    }
    
    // Create main controls container
    const container = document.createElement('div');
    container.id = 'draw-fourier-controls';
    
    // Circles control
    const circlesControl = createControlGroup({
        label: 'Circles:',
        value: () => state.numCircles,
        displayId: 'draw-fourier-circle-display',
        min: 1,
        max: 50,
        step: 1,
        formatValue: (val) => val.toString(),
        onDecrease: () => {
            if (state.numCircles > 1) {
                state.numCircles--;
            }
        },
        onIncrease: () => {
            if (state.numCircles < 50) {
                state.numCircles++;
            }
        }
    });
    container.appendChild(circlesControl);
    
    // Add separator
    container.appendChild(createSeparator());
    
    // Speed control
    const speedControl = createControlGroup({
        label: 'Speed:',
        value: () => state.speed,
        displayId: 'draw-fourier-speed-display',
        min: 0.01,
        max: 0.5,
        step: 0.01,
        formatValue: (val) => val.toFixed(2),
        onDecrease: () => {
            if (state.speed > 0.01) {
                state.speed = Math.round((state.speed - 0.01) * 100) / 100;
            }
        },
        onIncrease: () => {
            if (state.speed < 0.5) {
                state.speed = Math.round((state.speed + 0.01) * 100) / 100;
            }
        }
    });
    container.appendChild(speedControl);
    
    // Add separator
    container.appendChild(createSeparator());
    
    // Pause/Play button
    const pausePlayBtn = createActionButton({
        id: 'draw-fourier-pause-play-btn',
        text: state.paused ? '▶' : '⏸',
        onClick: () => {
            state.paused = !state.paused;
            const btn = document.getElementById('draw-fourier-pause-play-btn');
            if (btn) {
                btn.textContent = state.paused ? '▶' : '⏸';
            }
        }
    });
    container.appendChild(pausePlayBtn);
    
    // Reset button
    const resetBtn = createActionButton({
        text: '↻',
        onClick: () => {
            state.TIME = 0;
            state.drawing = [];
            state.fourier = [];
            state.numCircles = 10;
            state.speed = 0.05;
            updateDisplay('draw-fourier-speed-display', state.speed.toFixed(2));
            updateDisplay('draw-fourier-circle-display', state.numCircles.toString());
        }
    });
    resetBtn.style.cssText = 'width: 28px; padding: 0; min-width: 28px;';
    container.appendChild(resetBtn);
    
    document.body.appendChild(container);
    return container;
}

/**
 * Removes the draw Fourier controls
 */
function removeDrawFourierControls() {
    removeControl('draw-fourier-controls');
}