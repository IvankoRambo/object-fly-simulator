const CONSTS = {
    g: 9.8,
    minTopLimit: 0,
    maxTopLimit: 800,
    maxLeftLimit: 10e+3,
    minLeftLimit: 0,
    groundHeight: 10
};

const initialValues = {
    frameSpeed: 20,
    frameSpeedCoefficient: 1,
    top: 400,
    left: 15
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
