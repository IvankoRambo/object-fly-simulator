class Element {
    constructor() {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.background = 'black';
        this.elementType = 'box';
    }

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

    removeElement() {
        if (this.element) {
            const node = this.element;
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    }

    rotateElement(deg) {
        if (this.element) {
            this.element.style.transform = `rotate(${deg}deg)`;
            this.element.style['-webkit-transform'] = `rotate(${deg}deg)`;
            this.element.style['-moz-transform'] = `rotate(${deg}deg)`;
            this.element.style['transform-origin'] = `rotate(${deg}deg)`;
        }
    }

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
