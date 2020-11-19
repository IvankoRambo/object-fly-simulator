const CONSTS = {
    g: 9.8,
    minTopLimit: 100,
    maxTopLimit: 800,
    maxLeftLimit: 10e+3,
    minLeftLimit: -10e+3,
    groundHeight: 10,
    frameSpeed: 6,
    speedPerPixel: 0.53,
    pointerCircleDiameter: 10,
    globalWrapper: '.wrapper',
    pointerCircleCls: 'pointerCircle',
    frameSpeedCoefficientLength: 3,
    scrollExtra: 200,
    backgroundZIndex: -10
};

const initialValues = {
    frameSpeedCoefficient: 1,
    top: 400,
    left: 300,
    fireDegree: null,
    fireSpeed: null
};

/**
 * Initialize global data to use across all application
 * @returns {void}
 */
export const initStore = () => {
    window.app = window.app || {};
    window.app = initialValues;
    window.app.CONSTS = CONSTS;
};

/**
 * Setter to set a new value for particular store data
 * @param {string} name - the key to set in store
 * @param {string|number|Object} value -  the value of key to set in store
 * @returns {void}
 */
export const setToStore = (name, value) => {
    window.app[name] = value;
};

/**
 * Getter to get data from store by key
 * @param {string} name - the key of store to search for
 * @returns {Object|Array|string} store participant value
 */
export const getFromStore = name => window.app[name];
