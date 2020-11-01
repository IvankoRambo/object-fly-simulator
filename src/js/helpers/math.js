const formulas = {
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

    fromDegreesToRad: formulaArgs => {
        const { degrees } = formulaArgs;
        return (degrees * Math.PI) / 180;
    },

    fromRadToDegress: formulaArgs => {
        const { rad } = formulaArgs;
        return (180 * rad) / Math.PI;
    }

};

export const calculate = (formulaArgs, formulaTypeArg) => {
    const formulaType = formulaTypeArg || 'looselyThrownBody';
    return formulas[formulaType](formulaArgs);
};
