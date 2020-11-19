import Element from './Element';

class Background extends Element {
    /**
     * Background Element class to track object movement
     * @constructor
     */
    constructor() {
        super();
        this.left = window.app.CONSTS.minLeftLimit;
        this.top = 0;
        this.width = window.app.CONSTS.maxLeftLimit - window.app.CONSTS.minLeftLimit;
        this.height = window.app.CONSTS.maxTopLimit;
        this.background = 'transparent';
        this.zIndex = window.app.CONSTS.backgroundZIndex;
        this.imagePath = '/img/sky.jpg';
        this.element = this.createElement(true);
    }

    createElement(appendToBody) {
        const element = super.createElement(appendToBody);
        element.style.zIndex = this.zIndex;
        element.style.backgroundImage = `url(${this.imagePath})`;
        element.style.backgroundRepeat = 'repeat';

        return element;
    }
}

export default Background;
