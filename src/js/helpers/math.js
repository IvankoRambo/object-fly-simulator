const formulas = {

    /**
     * Calculates coordinates for thrown body
     * @param {Object} formulaArgs - contains needed params as time, initial coordinates e t c
     * @returns {number} result of formula
     */
    looselyThrownBody: formulaArgs => {
        const {
            x0,
            y0,
            Vo,
            angle,
            t
        } = formulaArgs;

        const x = x0 + Vo * t * Math.cos(angle);
        const y = y0 - Vo * t * Math.sin(angle) + (window.app.CONSTS.g * t * t) / 2;
        return {
            x,
            y
        };
    },

    /**
     * Convector from degrees to rad
     * @param {Object} formulaArgs - object which contains input degrees value
     * @returns {number} result of formula
     */
    fromDegreesToRad: formulaArgs => {
        const { degrees } = formulaArgs;
        return (degrees * Math.PI) / 180;
    },

    /**
     * Convector from rad to degrees
     * @param {Object} formulaArgs - object which contains input rad value
     * @returns {number} result of formula
     */
    fromRadToDegrees: formulaArgs => {
        const { rad } = formulaArgs;
        return (180 * rad) / Math.PI;
    }

};

/**
 * Calculates particular formula
 * @param {Object} formulaArgs - object with partucular input parameters needed for particular formula
 * @param {formulaTypeArg} formulaTypeArg - defines what formula to use by name which maps with key of formulas object
 * @returns {number} result of formula
 */
export const calculate = (formulaArgs, formulaTypeArg) => {
    const formulaType = formulaTypeArg || 'looselyThrownBody';
    return formulas[formulaType](formulaArgs);
};
