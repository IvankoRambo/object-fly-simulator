import Element from './Element';

class Canvas extends Element {
    constructor() {
        super();
        this.elementType = 'canvas';
        this.strokeWidth = null;
        this.moveTo = null;
        this.lineTo = null;

        this.resizeCanvas = this.resizeCanvas.bind(this);

        this.initEvents();
    }

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

    initEvents() {
        window.addEventListener('resize', this.resizeCanvas, false);
    }
}

export default Canvas;
