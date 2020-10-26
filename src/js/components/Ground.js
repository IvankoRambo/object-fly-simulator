import Element from './Element';

class Ground extends Element {
    constructor() {
        super();
        this.left = window.app.CONSTS.minLeftLimit;
        this.top = window.app.CONSTS.maxTopLimit;
        this.width = window.app.CONSTS.maxLeftLimit - window.app.CONSTS.minLeftLimit;
        this.height = window.app.CONSTS.groundHeight;
        this.element = this.createElement();
    }

    createElement() {
        const element = document.createElement('div');
        document.body.appendChild(element);
        element.style.position = 'absolute';
        element.style.top = `${this.top}px`;
        element.style.left = `${this.left}px`;
        element.style.width = `${this.width}px`;
        element.style.height = `${this.height}px`;
        element.style.backgroundColor = this.background;

        return element;
    }
}

export default Ground;
