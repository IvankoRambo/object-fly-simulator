import FlyObject from './components/FlyObject';
import Ground from './components/Ground';
import { setToStore, getFromStore } from './store';

export const createGroundObject = () => {
    const ground = new Ground();
    setToStore('ground', ground);
};

export const createFlyObject = () => {
    const flyObject = new FlyObject();
    setToStore('flyObject', flyObject);
};

export const startSimulation = () => {
    if (!getFromStore('ground')) {
        createGroundObject();
    }
    createFlyObject();
};
