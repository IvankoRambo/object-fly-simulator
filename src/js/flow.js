import FlyObject from './components/FlyObject';
import Ground from './components/Ground';
import InfoBar from './components/InfoBar';
import { setToStore, getFromStore } from './store';

const createGroundObject = () => {
    const ground = new Ground();
    setToStore('ground', ground);
};

const createInfoBar = () => {
    const infoBar = new InfoBar();
    setToStore('infobar', infoBar);
};

const createFlyObject = () => {
    const flyObject = new FlyObject();
    setToStore('flyObject', flyObject);
};

export const startSimulation = () => {
    if (!getFromStore('ground')) {
        createGroundObject();
    }
    if (!getFromStore('infobar')) {
        createInfoBar();
    }
    createFlyObject();
};
