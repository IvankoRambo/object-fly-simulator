const CONSTS = {
    g: 9.8,
    minTopLimit: 100,
    maxTopLimit: 800,
    maxLeftLimit: 10e+3,
    minLeftLimit: -10e+3,
    groundHeight: 10,
    frameSpeed: 6,
    metersPerPixel: 3,
    speedPerPixel: 0.23,
    pointerCircleDiameter: 10,
    globalWrapper: '.wrapper',
    pointerCircleCls: 'pointerCircle'
};

const initialValues = {
    frameSpeedCoefficient: 1,
    top: 400,
    left: 300,
    fireDegree: null,
    fireSpeed: null
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
