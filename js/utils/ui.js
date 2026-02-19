// UI Utility Functions for creating controls

/**
 * Creates a number control with +/- buttons
 * @param {Object} options - Configuration options
 * @param {string} options.containerId - ID for the controls container
 * @param {string} options.label - Label text
 * @param {number|Function} options.value - Initial value or getter function
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @param {Function} options.onChange - Callback when value changes
 * @param {string} options.displayId - ID for the display element
 * @returns {HTMLElement} The controls container element
 */
function createNumberControl(options) {
    const {
        containerId,
        label,
        value,
        min = 1,
        max = 100,
        onChange,
        displayId
    } = options;

    // Remove existing controls if any
    const existing = document.getElementById(containerId);
    if (existing) {
        existing.remove();
    }

    // Get initial value (support both number and getter function)
    const getCurrentValue = typeof value === 'function' ? value : () => value;
    let currentValue = getCurrentValue();

    // Create controls container
    const container = document.createElement('div');
    container.id = containerId;

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
        currentValue = getCurrentValue();
        if (currentValue > min) {
            const newValue = currentValue - 1;
            if (onChange) {
                onChange(newValue);
            }
            currentValue = getCurrentValue(); // Update after onChange
            updateDisplay(displayId, currentValue);
        }
    };
    container.appendChild(decreaseBtn);

    // Number display
    const numberDisplay = document.createElement('span');
    numberDisplay.id = displayId;
    numberDisplay.textContent = currentValue;
    container.appendChild(numberDisplay);

    // Increase button
    const increaseBtn = document.createElement('button');
    increaseBtn.textContent = '+';
    increaseBtn.className = 'control-btn';
    increaseBtn.onclick = () => {
        currentValue = getCurrentValue();
        if (currentValue < max) {
            const newValue = currentValue + 1;
            if (onChange) {
                onChange(newValue);
            }
            currentValue = getCurrentValue(); // Update after onChange
            updateDisplay(displayId, currentValue);
        }
    };
    container.appendChild(increaseBtn);

    document.body.appendChild(container);
    return container;
}

/**
 * Updates a display element with a new value
 * @param {string} displayId - ID of the display element
 * @param {number} value - New value to display
 */
function updateDisplay(displayId, value) {
    const display = document.getElementById(displayId);
    if (display) {
        display.textContent = value;
    }
}

/**
 * Removes a control container by ID
 * @param {string} containerId - ID of the container to remove
 */
function removeControl(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.remove();
    }
}
