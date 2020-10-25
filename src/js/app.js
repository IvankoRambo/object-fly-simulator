import { initStore } from './store';
import { startSimulation } from './flow';

const run = () => {
    initStore();
    startSimulation();
};

run();
