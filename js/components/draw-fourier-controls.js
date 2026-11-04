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

    // Speed control (steps through DRAW_SPEEDS)
    const speedIndex = () => DRAW_SPEEDS.indexOf(state.speed);
    const speedControl = createControlGroup({
        label: 'Speed:',
        value: () => state.speed,
        displayId: 'draw-fourier-speed-display',
        formatValue: (val) => `${val}×`,
        onDecrease: () => {
            const i = speedIndex();
            if (i > 0) state.speed = DRAW_SPEEDS[i - 1];
        },
        onIncrease: () => {
            const i = speedIndex();
            if (i < DRAW_SPEEDS.length - 1) state.speed = DRAW_SPEEDS[i + 1];
        }
    });
    container.appendChild(speedControl);
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
    
    // Right side: a column holding the Mode/Shape box and the Draw box
    const modeContainer = document.createElement('div');
    modeContainer.id = 'draw-fourier-mode-controls';

    const pickerBox = document.createElement('div');
    pickerBox.className = 'draw-fourier-box';
    modeContainer.appendChild(pickerBox);
    
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
    pickerBox.appendChild(modeControl);

    // Shape selector
    const shapeControl = createModeSelector({
        label: 'Shape:',
        value: state.shape,
        options: DRAW_SHAPES.map(({ value, label }) => ({ value, label })),
        onChange: (newShape) => {
            state.shape = newShape;
            setButtonActive(drawBtn, false);
            state.paused = false;
            const btn = document.getElementById('draw-fourier-pause-play-btn');
            if (btn) {
                btn.textContent = '⏸';
            }
            if (typeof reinitializeDrawFourierMode === 'function') {
                reinitializeDrawFourierMode();
            }
        }
    });
    pickerBox.appendChild(shapeControl);

    // Draw box: freehand drawing, kept apart from the shape list
    const drawBox = document.createElement('div');
    drawBox.className = 'draw-fourier-box';
    const drawBtn = document.createElement('button');
    drawBtn.id = 'draw-fourier-freehand-btn';
    drawBtn.textContent = '✏️ Draw';
    drawBtn.className = 'control-btn';
    drawBtn.style.cssText = 'padding: 8px 16px; min-width: 70px; font-size: 0.95rem; white-space: nowrap; height: auto; color: #ffffff;';
    setButtonActive(drawBtn, state.shape === 'freehand');
    drawBtn.onclick = () => {
        state.shape = 'freehand';
        startNewFreehandDrawing();
        setButtonActive(drawBtn, true);
        // No shape is selected while drawing
        Array.from(shapeControl.querySelectorAll('button')).forEach((b) => setButtonActive(b, false));
        if (typeof reinitializeDrawFourierMode === 'function') {
            reinitializeDrawFourierMode();
        }
    };
    drawBox.appendChild(drawBtn);
    modeContainer.appendChild(drawBox);

    document.body.appendChild(modeContainer);
    
    return container;
}

// Selected buttons are highlighted the same way as in createModeSelector
function setButtonActive(button, active) {
    button.style.background = active ? '#444444' : 'rgba(255, 255, 255, 0.1)';
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