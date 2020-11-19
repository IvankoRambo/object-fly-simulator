import Element from './Element';

class Ground extends Element {
    /**
     * Class that represents a zero limit position of app (ground)
     * @constructor
     */
    constructor() {
        super();
        this.left = window.app.CONSTS.minLeftLimit;
        this.top = window.app.CONSTS.maxTopLimit;
        this.width = window.app.CONSTS.maxLeftLimit - window.app.CONSTS.minLeftLimit;
        this.height = window.app.CONSTS.groundHeight;
        this.element = this.createElement(true);
    }
}

export default Ground;
