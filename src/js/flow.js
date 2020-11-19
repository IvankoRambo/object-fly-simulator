import FlyObject from './components/FlyObject';
import Ground from './components/Ground';
import InfoBar from './components/InfoBar';
import Background from './components/Background';
import { setToStore, getFromStore } from './store';
import { setInitialScrollBar } from './helpers/utils';

/**
 * Creates ground (zero level)
 * @returns {void}
 */
const createGroundObject = () => {
    const ground = new Ground();
    setToStore('ground', ground);
};

/**
 * Creates background to track object movement
 * @returns {void}
 */
const createBackgroundObject = () => {
    const background = new Background();
    setToStore('background', background);
};

/**
 * Represents init of informational bar with setters of parameters for
 * flying object
 * @returns {void}
 */
const createInfoBar = () => {
    const infoBar = new InfoBar();
    setToStore('infobar', infoBar);
};

/**
 * Creates flying object
 * @returns {void}
 */
const createFlyObject = () => {
    const flyObject = new FlyObject();
    setToStore('flyObject', flyObject);
};

/**
 * Main function responsible for all objects generation
 * @returns {void}
 */
export const startSimulation = () => {
    setInitialScrollBar(document.querySelector(window.app.CONSTS.globalWrapper));
    if (!getFromStore('ground')) {
        createGroundObject();
    }
    if (!getFromStore('background')) {
        createBackgroundObject();
    }
    if (!getFromStore('infobar')) {
        createInfoBar();
    }
    createFlyObject();
};
