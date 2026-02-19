// Square Wave Controls Component
// Handles all UI controls for the square wave visualization

/**
 * Creates the controls panel for square wave visualization
 * @param {Object} state - The square wave state object
 * @returns {HTMLElement} The controls container element
 */
function createSquareWaveControls(state) {
    // Remove existing controls if any
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
        value: () => state.numCircles, // Getter function
        displayId: 'circle-count-display',
        min: 1,
        max: 50,
        step: 1,
        formatValue: (val) => val.toString(),
        onDecrease: () => {
            if (state.numCircles > 1) {
                state.numCircles--;
                // Wave continues smoothly with new circle count
            }
        },
        onIncrease: () => {
            if (state.numCircles < 50) {
                state.numCircles++;
                // Wave continues smoothly with new circle count
            }
        }
    });
    container.appendChild(circlesControl);
    
    // Add separator
    container.appendChild(createSeparator());
    
    // Speed control
    const speedControl = createControlGroup({
        label: 'Speed:',
        value: () => state.speed, // Getter function
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
            state.numCircles = 10; // Reset circles to default
            state.speed = 0.05; // Reset speed to default
            updateDisplay('speed-display', state.speed.toFixed(2));
            updateDisplay('circle-count-display', state.numCircles.toString());
        }
    });
    // Reset button can be slightly wider since it doesn't change
    resetBtn.style.cssText = 'width: 28px; padding: 0; min-width: 28px;';
    container.appendChild(resetBtn);
    
    document.body.appendChild(container);
    return container;
}

/**
 * Creates a control group with label, decrease/increase buttons, and display
 * @param {Object} options - Configuration options
 * @returns {HTMLElement} The control group container
 */
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
        // Update display with current value from state
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
        // Update display with current value from state
        const getCurrentValue = typeof value === 'function' ? value : () => value;
        updateDisplay(displayId, formatValue(getCurrentValue()));
    };
    container.appendChild(increaseBtn);
    
    return container;
}

/**
 * Creates an action button (pause/play, reset, etc.)
 * @param {Object} options - Configuration options
 * @returns {HTMLElement} The button element
 */
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
    // Fixed width to prevent size changes when text changes
    button.style.cssText = 'width: 28px; padding: 0; min-width: 28px;';
    button.onclick = onClick;
    
    return button;
}

/**
 * Creates a separator element
 * @returns {HTMLElement} The separator element
 */
function createSeparator() {
    const separator = document.createElement('span');
    separator.style.cssText = 'width: 1px; height: 24px; background: #ffffff; margin: 0 6px;';
    return separator;
}

/**
 * Removes the square wave controls
 */
function removeSquareWaveControls() {
    removeControl('square-wave-controls');
}
