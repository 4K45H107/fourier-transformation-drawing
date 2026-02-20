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
    
    // Speed control
    const speedControl = createControlGroup({
        label: 'Speed:',
        value: () => state.speed,
        displayId: 'draw-fourier-speed-display',
        min: 1,
        max: 10,
        step: 1,
        formatValue: (val) => val.toString(),
        onDecrease: () => {
            if (state.speed > 1) {
                state.speed--;
            }
        },
        onIncrease: () => {
            if (state.speed < 10) {
                state.speed++;
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
            state.SIGNAL = [];
            state.WAVE = [];
            state.fourierY = [];
            state.numCircles = 10;
            state.speed = 1;
            updateDisplay('draw-fourier-speed-display', state.speed.toString());
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