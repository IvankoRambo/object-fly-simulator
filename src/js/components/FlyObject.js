import Element from './Element';
import Circle from './Circle';

import { getFromStore } from '../store';
import { calculate } from '../helpers/math';
import { checkCollision } from '../helpers/mediator';

class FlyObject extends Element {
    constructor(topArg, leftArg) {
        super();
        const top = topArg != null ? topArg : window.app.top;
        const left = leftArg != null ? leftArg : window.app.left;
        this.top = top;
        this.left = left;
        this.width = 80;
        this.height = this.width;
        this.background = 'red';
        this.element = this.createElement(true);
        this.animationEnd = false;
        this.t = 0;

        this.createPointerCircle();
    }

    createPointerCircle() {
        this.pointerCircle = new Circle();
        this.pointerCircle.width = 10;
        this.pointerCircle.height = 10;
        this.pointerCircle.element = this.pointerCircle.createElement();
        this.pointerCircle.element.style.top = `calc(50% - ${this.pointerCircle.height / 2}px)`;
        this.pointerCircle.element.style.left = `calc(50% - ${this.pointerCircle.width / 2}px)`;

        const relativeMiddleElement = document.createElement('div');
        relativeMiddleElement.style.position = 'relative';
        relativeMiddleElement.style.width = `${this.width}px`;
        relativeMiddleElement.style.height = `${this.height}px`;
        relativeMiddleElement.appendChild(this.pointerCircle.element);
        this.element.appendChild(relativeMiddleElement);
    }

    flyStep(angle, Vo) {
        this.t += 0.1;
        const formulaArgs = {
            Vo,
            angle,
            t: this.t
        };

        const offset = calculate(formulaArgs);
        this.left = offset.x;
        this.top = offset.y;
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;

        const ground = getFromStore('ground');
        if (ground) {
            const collisionData = checkCollision(this, ground);
            this.animationEnd = collisionData.collision;
        }
    }

    invokeAnimation(angleArg, VoArg) {
        const angle = angleArg != null ? angleArg : window.app.angle;
        const Vo = VoArg != null ? VoArg : window.app.VoArg;

        const animation = setInterval(() => {
            this.flyStep(angle, Vo);
            if (this.animationEnd) {
                clearInterval(animation);
            }
        }, window.app.CONSTS.frameSpeed);
    }
}

export default FlyObject;
