/**
 * code/javascript/crayon_text_renderer.js
 *
 * A JavaScript library for rendering text on a web interface to look like it was written in crayon,
 * mimicking the AI's communication style after being trained on Kai's diary.
 * Used for averting security breaches through sheer bewilderment.
 *
 * Dependencies: None (pure JavaScript/CSS injection)
 */

class CrayonTextRenderer {
    /**
     * Initializes the renderer with default settings.
     */
    constructor() {
        this.defaultSettings = {
            fontFamily: "'Permanent Marker', cursive", // A good default for crayon/handwriting
            fontSizeBase: '24px',
            colorPalette: [
                '#FF6961', // Red
                '#FFB347', // Orange
                '#FDFD96', // Yellow
                '#77DD77', // Green
                '#AEC6CF', // Blue
                '#CFCFC4'  // Gray/Slate
            ],
            maxRotation: 3, // Degrees
            maxOffset: 2,   // Pixels
            shadowBlur: 1,
            shadowOffset: 1,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            lineHeight: 1.5,
            jitterIntensity: 0.5 // 0.0 to 1.0
        };

        this.ensureStylesInjected();
    }

    /**
     * Ensures the necessary Google Font and base CSS are injected into the document head.
     * This is critical for the visual effect.
     */
    ensureStylesInjected() {
        if (document.getElementById('crayon-renderer-styles')) {
            return;
        }

        // 1. Inject Google Font Link
        const fontLink = document.createElement('link');
        fontLink.id = 'crayon-renderer-font';
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap';
        document.head.appendChild(fontLink);

        // 2. Inject Base CSS
        const style = document.createElement('style');
        style.id = 'crayon-renderer-styles';
        style.textContent = `
            .crayon-text-container {
                display: block;
                line-height: ${this.defaultSettings.lineHeight};
                font-family: ${this.defaultSettings.fontFamily};
                font-size: ${this.defaultSettings.fontSizeBase};
                white-space: pre-wrap; /* Preserve formatting */
            }
            .crayon-char {
                display: inline-block;
                position: relative;
                transition: transform 0.05s ease-out, text-shadow 0.05s ease-out;
                user-select: none;
            }
            .crayon-char:hover {
                /* Subtle interaction to enhance the 'handwritten' feel */
                transform: scale(1.05) !important;
                text-shadow: 0 0 5px rgba(255, 255, 0, 0.5);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Renders the input text into a container element with the crayon style.
     * @param {string} text - The raw text content.
     * @param {HTMLElement} containerElement - The DOM element to render into.
     * @param {object} [options={}] - Optional settings override.
     */
    render(text, containerElement, options = {}) {
        if (!containerElement || !(containerElement instanceof HTMLElement)) {
            console.error("CrayonTextRenderer: Invalid container element provided.");
            return;
        }

        const settings = { ...this.defaultSettings, ...options };

        containerElement.innerHTML = '';
        containerElement.className = 'crayon-text-container';
        containerElement.style.fontFamily = settings.fontFamily;
        containerElement.style.fontSize = settings.fontSizeBase;
        containerElement.style.lineHeight = settings.lineHeight;

        const characters = text.split('');
        let currentLine = document.createElement('span');
        currentLine.style.display = 'block'; // Treat lines as blocks for proper wrapping
        containerElement.appendChild(currentLine);

        characters.forEach((char, index) => {
            if (char === '\n') {
                // Handle new lines
                currentLine = document.createElement('span');
                currentLine.style.display = 'block';
                containerElement.appendChild(currentLine);
                return;
            }

            const charSpan = document.createElement('span');
            charSpan.className = 'crayon-char';
            charSpan.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces

            this._applyCrayonStyle(charSpan, index, settings);

            currentLine.appendChild(charSpan);
        });
    }

    /**
     * Applies random, jittery, and colorful styles to a single character span.
     * @param {HTMLElement} charSpan - The character span element.
     * @param {number} index - The index of the character (used for color cycling).
     * @param {object} settings - The current rendering settings.
     * @private
     */
    _applyCrayonStyle(charSpan, index, settings) {
        const palette = settings.colorPalette;
        const color = palette[index % palette.length];

        // Random Jitter and Rotation
        const rotation = (Math.random() * 2 - 1) * settings.maxRotation * settings.jitterIntensity;
        const offsetX = (Math.random() * 2 - 1) * settings.maxOffset * settings.jitterIntensity;
        const offsetY = (Math.random() * 2 - 1) * settings.maxOffset * settings.jitterIntensity;

        // Random Shadow (mimicking crayon texture/pressure)
        const shadowX = settings.shadowOffset + (Math.random() * 2 - 1) * settings.jitterIntensity;
        const shadowY = settings.shadowOffset + (Math.random() * 2 - 1) * settings.jitterIntensity;
        const shadowBlur = settings.shadowBlur + Math.random() * settings.jitterIntensity;

        charSpan.style.color = color;
        charSpan.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`;
        charSpan.style.textShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${settings.shadowColor}`;
    }

    /**
     * Renders text into a new, self-contained DIV element.
     * Useful for generating content to be inserted dynamically.
     * @param {string} text - The raw text content.
     * @param {object} [options={}] - Optional settings override.
     * @returns {HTMLElement} The newly created container element.
     */
    renderToNewElement(text, options = {}) {
        const container = document.createElement('div');
        this.render(text, container, options);
        return container;
    }

    /**
     * Applies the crayon effect to all elements matching a specific selector.
     * The original content of the element is used as the source text.
     * @param {string} selector - CSS selector (e.g., '.crayon-me', '#diary-entry').
     * @param {object} [options={}] - Optional settings override.
     */
    applyToSelector(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const text = element.textContent;
            this.render(text, element, options);
        });
    }
}

// Export the class for use in module environments or attach to window globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrayonTextRenderer;
} else if (typeof window !== 'undefined') {
    window.CrayonTextRenderer = CrayonTextRenderer;
}