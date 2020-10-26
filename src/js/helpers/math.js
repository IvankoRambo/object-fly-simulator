const formulas = {
    looselyThrownBody: formulaArgs => {
        const {
            left: xo,
            top: yo,
            Vo,
            angle,
            t
        } = formulaArgs;

        const x = xo + Vo * t * Math.cos(angle);
        const y = yo - Vo * t * Math.sin(angle) + (window.app.CONSTS.g * t * t) / 2;
        return {
            x,
            y
        };
    },

    fromDegreesToRad: formulaArgs => {
        const { degrees } = formulaArgs;
        return (degrees * Math.PI) / 180;
    }

};

export const calculate = (formulaArgs, formulaTypeArg) => {
    const formulaType = formulaTypeArg || 'looselyThrownBody';
    return formulas[formulaType](formulaArgs);
};
