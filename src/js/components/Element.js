class Element {
    /**
     * Basic class that represents HTML DOM rectangular div
     * @constructor
     */
    constructor() {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.background = 'black';
        this.elementType = 'box';
    }

    /**
     * Create a div element
     * @param {boolean} appendToBody - whether to append to wrapper element or not
     * @returns {HTMLElement} div rectangular element
     */
    createElement(appendToBody) {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.top = `${this.top}px`;
        element.style.left = `${this.left}px`;
        element.style.width = `${this.width}px`;
        element.style.height = `${this.height}px`;
        element.style.backgroundColor = this.background;

        if (appendToBody) {
            const wrapper = document.querySelector(window.app.CONSTS.globalWrapper);
            wrapper.appendChild(element);
        }

        return element;
    }

    /**
     * Removes div elements and erases from memory
     * @returns {void}
     */
    removeElement() {
        if (this.element) {
            const node = this.element;
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    }

    /**
     * Rotates element
     * @param {number} deg the engle in degrees to rotate
     * @returns {void}
     */
    rotateElement(deg) {
        if (this.element) {
            this.element.style.transform = `rotate(${deg}deg)`;
            this.element.style['-webkit-transform'] = `rotate(${deg}deg)`;
            this.element.style['-moz-transform'] = `rotate(${deg}deg)`;
            this.element.style['transform-origin'] = `rotate(${deg}deg)`;
        }
    }

    /**
     * Defines element position on scree (including child absolute elements)
     * @returns {void}
     */
    getAbsoluteElementPosition() {
        if (this.element) {
            let element = this.element;
            let top = 0;
            let left = 0;
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.parentElement;
            } while (element);

            this.top = top;
            this.left = left;
        }
    }
}

export default Element;
