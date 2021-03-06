import { defineParamsSettingsError } from '../helpers/utils';
import { setToStore, getFromStore } from '../store';
import { calculate } from '../helpers/math';

class InfoBar {
    /**
     * Class that represents information bar
     * Here it is available:
     * - define object fly animation params by typing params in inputs of bar
     * - see the results of length of object fly
     * @constructor
     */
    constructor() {
        this.cache = {
            degreesInfoLine: document.querySelector('.b-info-bar-settings-panel.degrees .infoline'),
            speedInfoLine: document.querySelector('.b-info-bar-settings-panel.speed .infoline'),
            heightInfoLine: document.querySelector('.b-info-bar-settings-panel.height .infoline'),
            simulationSpeedInfoLine: document.querySelector('.b-info-bar-settings-panel.simulationSpeed .infoline'),
            degreesInput: document.querySelector('.b-info-bar-settings-panel.degrees .text'),
            speedInput: document.querySelector('.b-info-bar-settings-panel.speed .text'),
            heightInput: document.querySelector('.b-info-bar-settings-panel.height .text'),
            simulationSpeedInput: document.querySelector('.b-info-bar-settings-panel.simulationSpeed .text'),
            degreesButton: document.querySelector('.b-info-bar-settings-panel.degrees .submit'),
            speedButton: document.querySelector('.b-info-bar-settings-panel.speed .submit'),
            heightButton: document.querySelector('.b-info-bar-settings-panel.height .submit'),
            simulationSpeedButton: document.querySelector('.b-info-bar-settings-panel.simulationSpeed .submit'),
            degreesError: document.querySelector('.b-info-bar-settings-panel.degrees .error-message'),
            speedError: document.querySelector('.b-info-bar-settings-panel.speed .error-message'),
            heightError: document.querySelector('.b-info-bar-settings-panel.height .error-message'),
            simulationSpeedError: document.querySelector('.b-info-bar-settings-panel.simulationSpeed .error-message'),
            startAnimationButton: document.querySelector('.b-info-bar-settings-panel.fire .submit'),
            startAnimationError: document.querySelector('.b-info-bar-settings-panel.fire .error-message'),
            measurePlaceholder: document.querySelector('.b-info-bar-info-placeholder--measure'),
            measureLength: document.querySelector('.b-info-bar-info-placeholder--length')
        };

        this.settingsButtonPress = this.settingsButtonPress.bind(this);
        this.startAnimationButtonPress = this.startAnimationButtonPress.bind(this);

        this.fillInfoline('degrees');
        this.fillInfoline('speed');
        this.fillInfoline('height');
        this.fillInfoline('simulationSpeed');

        this.setSimulationSpeeds();
        this.setMeasurePlaceholder();

        this.initEvents();
    }

    /**
     * Fills info after submit of object fly params
     * @param {string} typeArg - type of parameter
     * @returns {void}
     */
    fillInfoline(typeArg) {
        const type = typeArg || 'degrees';
        let element;
        let text;

        switch (type) {
            case 'degrees':
                element = this.cache.degreesInfoLine;
                if (window.app.fireDegree != null) {
                    text = `Current angle: ${parseInt(window.app.fireDegree, 10)}°`;
                }
                break;
            case 'speed':
                element = this.cache.speedInfoLine;
                if (window.app.fireSpeed != null) {
                    text = `Current speed: ${parseInt(window.app.fireSpeed, 10)} m/s`;
                }
                break;
            case 'height':
                element = this.cache.heightInfoLine;
                if (window.app.top != null) {
                    text = `Current top position: ${window.app.top}px`;
                }
                break;
            case 'simulationSpeed':
                element = this.cache.simulationSpeedInfoLine;
                if (window.app.frameSpeedCoefficient != null) {
                    text = `Current simulation speed coefficient: ${window.app.frameSpeedCoefficient}`;
                }
                break;
            default:
                break;
        }

        if (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            if (text) {
                element.appendChild(document.createTextNode(text));
            }
        }
    }

    /**
     * Fills selector of simulation speed with all possible variants
     * @returns {void}
     */
    setSimulationSpeeds() {
        if (window.app.CONSTS.frameSpeedCoefficientLength) {
            for (let i = 1; i <= window.app.CONSTS.frameSpeedCoefficientLength; i += 1) {
                const option = document.createElement('option');
                option.value = i;
                option.appendChild(document.createTextNode(i));
                if (i === window.app.frameSpeedCoefficient) {
                    option.selected = 'selected';
                }
                this.cache.simulationSpeedInput.appendChild(option);
            }
        }
    }

    /**
     * Process and sets submitted flying params
     * @param {string} typeArg - type of parameter
     * @returns {void}
     */
    settingsButtonPress(typeArg) {
        const type = typeArg || 'degrees';
        let input;
        let errorBlock;

        switch (type) {
            case 'degrees':
                input = this.cache.degreesInput;
                errorBlock = this.cache.degreesError;
                break;
            case 'speed':
                input = this.cache.speedInput;
                errorBlock = this.cache.speedError;
                break;
            case 'height':
                input = this.cache.heightInput;
                errorBlock = this.cache.heightError;
                break;
            case 'simulationSpeed':
                input = this.cache.simulationSpeedInput;
                errorBlock = this.cache.simulationSpeedError;
                break;
            default:
                break;
        }

        const errored = defineParamsSettingsError(input, type);

        while (errorBlock.firstChild) {
            errorBlock.removeChild(errorBlock.firstChild);
        }

        if (errored) {
            errorBlock.appendChild(document.createTextNode(errored));
        } else {
            const value = parseFloat(input.value);
            const flyObject = getFromStore('flyObject');

            switch (type) {
                case 'degrees':
                    setToStore('fireDegree', value);
                    break;
                case 'speed':
                    setToStore('fireSpeed', value);
                    break;
                case 'height':
                    setToStore('top', value);
                    if (flyObject) {
                        flyObject.setElementTop(value);
                    }
                    break;
                case 'simulationSpeed':
                    setToStore('frameSpeedCoefficient', value);
                    break;
                default:
                    break;
            }

            this.fillInfoline(type);
        }
    }

    /**
     * Starts animation from info bar if all params are fine
     * @param {Object} evt - event object
     * @returns {void}
     */
    startAnimationButtonPress(evt) {
        evt.preventDefault();
        const flyObject = getFromStore('flyObject');
        let errored = false;

        const deg = getFromStore('fireDegree');
        const speed = getFromStore('fireSpeed');
        const height = getFromStore('top');
        const simulationSpeed = getFromStore('frameSpeedCoefficient');

        if (deg == null || speed == null || height == null || simulationSpeed == null) {
            errored = 'The following parameters are not set yet: ';
            errored += deg == null ? 'angle,' : '';
            errored += speed == null ? 'speed,' : '';
            errored += height == null ? 'height,' : '';
            errored += simulationSpeed == null ? 'simulation speed,' : '';
            errored = errored.substring(0, errored.length - 1);
        }

        while (this.cache.startAnimationError.firstChild) {
            this.cache.startAnimationError.removeChild(this.cache.startAnimationError.firstChild);
        }

        if (errored) {
            this.cache.startAnimationError.appendChild(document.createTextNode(errored));
        } else if (flyObject) {
            flyObject.invokeAnimation(calculate({ degrees: deg }, 'fromDegreesToRad'), speed);
        }
    }

    setMeasurePlaceholder() {
        this.cache.measurePlaceholder.appendChild(document.createTextNode('1px = 1 meter'));
    }

    /**
     * Displays current length of object flying
     * @param {number} l - length in pixels
     * @returns {void}
     */
    setMeasureLength(l) {
        if (l) {
            while (this.cache.measureLength.firstChild) {
                this.cache.measureLength.removeChild(this.cache.measureLength.firstChild);
            }

            this.cache.measureLength.appendChild(document.createTextNode(`L = ${Math.round(l)} meters`));
        }
    }

    /**
     * Initialize events for informational bar action elements
     * @returns {void}
     */
    initEvents() {
        this.cache.degreesButton.addEventListener('click', evt => {
            evt.preventDefault();
            this.settingsButtonPress('degrees');
        }, false);

        this.cache.speedButton.addEventListener('click', evt => {
            evt.preventDefault();
            this.settingsButtonPress('speed');
        }, false);

        this.cache.heightButton.addEventListener('click', evt => {
            evt.preventDefault();
            this.settingsButtonPress('height');
        }, false);

        this.cache.simulationSpeedButton.addEventListener('click', evt => {
            evt.preventDefault();
            this.settingsButtonPress('simulationSpeed');
        }, false);

        this.cache.startAnimationButton.addEventListener('click', this.startAnimationButtonPress, false);
    }
}

export default InfoBar;
