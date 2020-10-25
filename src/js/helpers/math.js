const formulas = {
    looselyThrownBody: (xo, yo, Vo, angle, t) => {
        const x = xo + Vo * t * Math.cos(angle);
        const y = yo - Vo * t * Math.sin(angle) + (window.app.CONSTS.g * t * t) / 2;
        return {
            x,
            y
        };
    }
};

export const calculate = (left, top, Vo, angle, t, formulaTypeArg) => {
    const formulaType = formulaTypeArg || 'looselyThrownBody';
    return formulas[formulaType](left, top, Vo, angle, t);
};
