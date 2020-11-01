import { getFromStore } from '../store';

export const calculateMaxTopPosition = element => {
    const offsetHeight = element ? element.offsetHeight : 0;
    return window.app.CONSTS.maxTopLimit - offsetHeight;
};

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
