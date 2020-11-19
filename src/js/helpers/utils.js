import { getFromStore } from '../store';

/**
 * Helper function to calculate max allowed lower starter position of flying element
 * @param {HTMLElement} element - flying object
 * @returns {number} lower position (counter from 0 top of page)
 */
export const calculateMaxTopPosition = element => {
    const offsetHeight = element ? element.offsetHeight : 0;
    return window.app.CONSTS.maxTopLimit - offsetHeight;
};

/**
 * Helper function to validate user's parameters (angle, Vo, height) submissions
 * Check allowed limits, emptiness e t c
 * @param {HTMLElement} input - input to take the value from
 * @param {string} typeArg - type of submission to identify what parameter is submitted
 * @returns {boolean|string} false status of error (no error) or error message
 */
export const defineParamsSettingsError = (input, typeArg) => {
    const type = typeArg || 'degrees';
    const flyObject = getFromStore('flyObject');
    let errored = false;
    let value = input.value;

    if (!value || Number.isNaN(value)) {
        errored = 'The value should not be empty and should be a digit';
    }

    value = parseFloat(value);

    if (!errored) {
        switch (type) {
            case 'degrees':
                if (value < 0 || value >= 360) {
                    errored = 'The angle should be between 0 and 359 degrees';
                }
                break;
            case 'speed':
                if (value < 0) {
                    errored = 'The speed should be a non-negative value';
                }
                break;
            case 'height':
                if (flyObject) {
                    const maxTopLimit = calculateMaxTopPosition(flyObject.element);
                    if (value < window.app.CONSTS.minTopLimit || value > maxTopLimit) {
                        errored = `Height value should be between ${window.app.CONSTS.minTopLimit}px and ${maxTopLimit}px`;
                    }
                }
                break;
            default:
                break;
        }
    }

    return errored;
};

/**
 * Make initial scroll position
 * @param {HTMLElement} elementArg - element to set scroll by
 * @returns {void}
 */
export const setInitialScrollBar = elementArg => {
    const element = elementArg || window;
    element.scrollTo(0, 0);
};

/**
 * Tracks elements position and moves scroll by X if needed
 * @param {number} currentLeft - current element X position
 * @param {number} previousLeft - previous element X position
 * @param {number} scrollXArg - page X offset
 * @param {HTMLElement} elementArg - element to set scroll by
 * @returns {number} new scroll X position
 */
export const trackElementFly = (currentLeft, previousLeft, scrollXArg, elementArg) => {
    let scrollX = scrollXArg != null ? scrollXArg : 0;
    const element = elementArg || window;
    const scrollExtra = window.app.CONSTS.scrollExtra;

    if (currentLeft > window.innerWidth - scrollExtra) {
        scrollX += currentLeft - previousLeft;
    }

    element.scrollTo(scrollX, 0);

    return scrollX;
};
