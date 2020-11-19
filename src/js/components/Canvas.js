import Element from './Element';

class Canvas extends Element {
    /**
     * Class to represent Canvas elements (has interface for line drawing)
     * @constructor
     */
    constructor() {
        super();
        this.elementType = 'canvas';
        this.strokeWidth = null;
        this.moveTo = null;
        this.lineTo = null;

        this.resizeCanvas = this.resizeCanvas.bind(this);

        this.initEvents();
    }

    /**
     * Method to create <canvas> tag
     * @param {boolean} appendToBody - whether to append to wrapper element or not
     * @returns {HTMLElement} <canvas> tag
     */
    createElement(appendToBody) {
        const element = document.createElement('CANVAS');
        element.style.position = 'absolute';
        element.style.left = 0;
        element.style.top = 0;
        element.width = window.innerWidth;
        element.height = window.innerHeight;
        this.width = element.width;
        this.height = element.height;

        if (appendToBody) {
            const wrapper = document.querySelector(window.app.CONSTS.globalWrapper);
            wrapper.appendChild(element);
        }

        return element;
    }

    /**
     * Method to manage draw line interfaces
     * @param {Object} moveTo - object with x and y coordinates of the line beginning
     * @param {Object} lineTo - object with x and y coordinates of the line ending
     * @param {number} strokeWidth - the width of the line to set
     * @returns {void}
     */
    drawLine(moveTo, lineTo, strokeWidth) {
        if (this.element) {
            const ctx = this.element.getContext('2d');
            ctx.beginPath();
            ctx.save();
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            ctx.save();
            ctx.strokeStyle = this.background;
            ctx.lineWidth = strokeWidth;
            this.strokeWidth = strokeWidth;
            ctx.moveTo(moveTo.x, moveTo.y);
            ctx.lineTo(lineTo.x, lineTo.y);
            this.moveTo = moveTo;
            this.lineTo = lineTo;
            ctx.stroke();
            ctx.restore();
        }
    }

    /**
     * Method to be fired in case of screen size change to chagne canvas dimensions
     * @returns {void}
     */
    resizeCanvas() {
        if (this.element) {
            this.element.width = window.innerWidth;
            this.element.height = window.innerHeight;
            this.width = this.element.width;
            this.height = this.element.height;

            if (this.moveTo) {
                this.drawLine(this.moveTo, this.lineTo, this.strokeWidth);
            }
        }
    }

    /**
     * Method for events storing
     * @returns {void}
     */
    initEvents() {
        window.addEventListener('resize', this.resizeCanvas, false);
    }
}

export default Canvas;
