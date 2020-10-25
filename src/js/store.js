const CONSTS = {
    g: 9.8
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
