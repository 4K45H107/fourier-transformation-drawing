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
            state.PATH = [];
            state.paused = false;
            
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

function removeDrawFourierControls() {
    removeControl('draw-fourier-controls');
}