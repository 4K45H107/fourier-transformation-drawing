function createSquareWaveControls(state) {
    // Remove existing controls
    const existing = document.getElementById('square-wave-controls');
    if (existing) {
        existing.remove();
    }
    
    // Create main controls container
    const container = document.createElement('div');
    container.id = 'square-wave-controls';
    
    // Circles control
    const circlesControl = createControlGroup({
        label: 'Circles:',
        value: () => state.numCircles,
        displayId: 'circle-count-display',
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
        displayId: 'speed-display',
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
        id: 'pause-play-btn',
        text: state.paused ? '▶' : '⏸',
        onClick: () => {
            state.paused = !state.paused;
            const btn = document.getElementById('pause-play-btn');
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
            state.numCircles = 10;
            state.speed = 0.05;
            updateDisplay('speed-display', state.speed.toFixed(2));
            updateDisplay('circle-count-display', state.numCircles.toString());
        }
    });
    resetBtn.style.cssText = 'width: 28px; padding: 0; min-width: 28px;';
    container.appendChild(resetBtn);
    
    document.body.appendChild(container);
    return container;
}

function createControlGroup(options) {
    const {
        label,
        value,
        displayId,
        min,
        max,
        step,
        formatValue,
        onDecrease,
        onIncrease
    } = options;
    
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    
    // Label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'control-label';
    container.appendChild(labelElement);
    
    // Decrease button
    const decreaseBtn = document.createElement('button');
    decreaseBtn.textContent = '−';
    decreaseBtn.className = 'control-btn';
    decreaseBtn.onclick = () => {
        onDecrease();
        const getCurrentValue = typeof value === 'function' ? value : () => value;
        updateDisplay(displayId, formatValue(getCurrentValue()));
    };
    container.appendChild(decreaseBtn);
    
    // Display
    const display = document.createElement('span');
    display.id = displayId;
    const getCurrentValue = typeof value === 'function' ? value : () => value;
    display.textContent = formatValue(getCurrentValue());
    display.style.cssText = 'color: #ffffff; font-size: 1rem; font-weight: bold; min-width: 30px; text-align: center;';
    container.appendChild(display);
    
    // Increase button
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.className = 'control-btn';
    increaseBtn.onclick = () => {
        onIncrease();
        const getCurrentValue = typeof value === 'function' ? value : () => value;
        updateDisplay(displayId, formatValue(getCurrentValue()));
    };
    container.appendChild(increaseBtn);
    
    return container;
}

function createActionButton(options) {
    const {
        id,
        text,
        onClick
    } = options;
    
    const button = document.createElement('button');
    if (id) button.id = id;
    button.className = 'control-btn';
    button.textContent = text;
    button.style.cssText = 'width: 28px; padding: 0; min-width: 28px;';
    button.onclick = onClick;
    
    return button;
}

function createSeparator() {
    const separator = document.createElement('span');
    separator.style.cssText = 'width: 1px; height: 24px; background: #ffffff; margin: 0 6px;';
    return separator;
}

function removeSquareWaveControls() {
    removeControl('square-wave-controls');
}
