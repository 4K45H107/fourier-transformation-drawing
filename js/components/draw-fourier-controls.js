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
            state.WAVE = [];
            state.paused = false;
            
            // Regenerate SIGNAL and fourierY
            state.SIGNAL = [];
            for(let i = 0; i < 250; i++) {
                state.SIGNAL[i] = i;
            }
            state.fourierY = DFT(state.SIGNAL);
            
            const btn = document.getElementById('draw-fourier-pause-play-btn');
            if (btn) {
                btn.textContent = '⏸';
            }
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