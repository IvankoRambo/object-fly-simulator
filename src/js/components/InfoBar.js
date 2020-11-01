import { defineParamsSettingsError } from '../helpers/utils';
import { setToStore, getFromStore } from '../store';
import { calculate } from '../helpers/math';

class InfoBar {
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
            startAnimationError: document.querySelector('.b-info-bar-settings-panel.fire .error-message')
        };

        this.settingsButtonPress = this.settingsButtonPress.bind(this);
        this.startAnimationButtonPress = this.startAnimationButtonPress.bind(this);

        this.fillInfoline('degrees');
        this.fillInfoline('speed');
        this.fillInfoline('height');
        this.fillInfoline('simulationSpeed');

        this.setSimulationSpeeds();

        this.initEvents();
    }

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
