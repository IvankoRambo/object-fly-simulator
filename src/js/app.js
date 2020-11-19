import { initStore } from './store';
import { startSimulation } from './flow';

/**
 * Entry point of application which starts initialize global data and objects
 * @returns {void}
 */
const run = () => {
    initStore();
    startSimulation();
};

run();
