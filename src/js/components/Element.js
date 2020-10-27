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
            document.body.appendChild(element);
        }

        return element;
    }
}

export default Element;
