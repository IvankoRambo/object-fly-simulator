const CONSTS = {
    g: 9.8,
    minTopLimit: 0,
    maxTopLimit: 800,
    maxLeftLimit: 10e+3,
    minLeftLimit: 0,
    groundHeight: 10,
    frameSpeed: 6,
    metersPerPixel: 3,
    pointerCircleDiameter: 10,
    globalWrapper: '.wrapper'
};

const initialValues = {
    frameSpeedCoefficient: 1,
    top: 400,
    left: 300
};

export const initStore = () => {
    window.app = window.app || {};
    window.app = initialValues;
    window.app.CONSTS = CONSTS;
};

export const setToStore = (name, value) => {
    window.app[name] = value;
};

export const getFromStore = name => window.app[name];
