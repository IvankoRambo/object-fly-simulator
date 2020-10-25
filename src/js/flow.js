import FlyObject from './components/FlyObject';

export const createFlyObject = () => {
    const flyObject = new FlyObject();
    //flyObject.invokeAnimation(45, 10);
};

export const startSimulation = () => {
    createFlyObject();
};
