function createDrawFourierControls(state) {
    // Remove existing controls if any
    const existingMain = document.getElementById('draw-fourier-controls');
    if (existingMain) {
        existingMain.remove();
    }
    const existingMode = document.getElementById('draw-fourier-mode-controls');
    if (existingMode) {
        existingMode.remove();
    }
    
    // Create main controls container (pause/play/reset) - top center
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
    
    // Create separate mode controls container - right side
    const modeContainer = document.createElement('div');
    modeContainer.id = 'draw-fourier-mode-controls';
    
    // Mode selector
    const modeControl = createModeSelector({
        label: 'Mode:',
        value: state.mode,
        options: [
            { value: 'single', label: 'Single' },
            { value: 'dual', label: 'Dual' }
        ],
        onChange: (newMode) => {
            state.mode = newMode;
            if (typeof reinitializeDrawFourierMode === 'function') {
                reinitializeDrawFourierMode();
            }
        }
    });
    modeContainer.appendChild(modeControl);
    
    document.body.appendChild(modeContainer);
    
    return container;
}

function createModeSelector(options) {
    const {
        label,
        value,
        options: modeOptions,
        onChange
    } = options;
    
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start; gap: 8px;';
    
    // Label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'control-label';
    container.appendChild(labelElement);
    
    // Mode buttons container - vertical layout
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
    
    modeOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.label;
        btn.className = 'control-btn';
        btn.style.cssText = `padding: 8px 16px; min-width: 70px; font-size: 0.95rem; white-space: nowrap; height: auto; ${
            value === option.value 
                ? 'background: #444444; color: #ffffff;' 
                : 'background: rgba(255, 255, 255, 0.1); color: #ffffff;'
        }`;
        
        btn.onclick = () => {
            onChange(option.value);
            // Update button styles
            modeOptions.forEach(opt => {
                const button = Array.from(buttonsContainer.children).find(
                    b => b.textContent === opt.label
                );
                if (button) {
                    if (opt.value === option.value) {
                        button.style.background = '#444444';
                    } else {
                        button.style.background = 'rgba(255, 255, 255, 0.1)';
                    }
                }
            });
        };
        
        buttonsContainer.appendChild(btn);
    });
    
    container.appendChild(buttonsContainer);
    return container;
}

function removeDrawFourierControls() {
    removeControl('draw-fourier-controls');
    removeControl('draw-fourier-mode-controls');
}