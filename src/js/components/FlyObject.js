import Element from './Element';

import { calculate } from '../helpers/math';
import { checkCollision } from '../helpers/mediator';

let n = 0;

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
        this.element = this.createElement();
        this.animationEnd = false;
        this.t = 0;
    }

    flyStep(angle, Vo) {
        this.t += 0.1;
        const formulaArgs = {
            left: this.left,
            top: this.top,
            Vo,
            angle,
            t: this.t
        };

        const offset = calculate(formulaArgs);
        this.left = offset.x;
        this.top = offset.y;
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;

        n++;
        if (n === 20) {
            this.animationEnd = true;
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
        }, window.app.frameSpeed);
    }
}

export default FlyObject;
