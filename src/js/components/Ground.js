import Element from './Element';

class Ground extends Element {
    constructor() {
        super();
        this.left = window.app.CONSTS.minLeftLimit;
        this.top = window.app.CONSTS.maxTopLimit;
        this.width = window.app.CONSTS.maxLeftLimit - window.app.CONSTS.minLeftLimit;
        this.height = window.app.CONSTS.groundHeight;
        this.element = this.createElement(true);
    }

    createElement(appendToBody) {
        const element = super.createElement(appendToBody);
        element.style.backgroundColor = this.background;

        return element;
    }
}

export default Ground;
