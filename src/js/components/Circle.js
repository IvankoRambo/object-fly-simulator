import Element from './Element';

class Circle extends Element {
    /**
     * Basic class that represents HTML DOM div with circle styles (extends from Element)
     * @constructor
     */
    constructor() {
        super();
        this.elementType = 'circle';
    }

    createElement(appendToBody) {
        const element = super.createElement(appendToBody);
        element.style.borderRadius = '50%';

        return element;
    }

    /**
     * Defines circle radius and central point coordinates
     * @returns {void}
     */
    defineCircleParams() {
        this.radius = this.height / 2;
        this.leftCenter = this.left + this.width / 2;
        this.topCenter = this.top + this.height / 2;
    }
}

export default Circle;
