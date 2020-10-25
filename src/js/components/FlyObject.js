import { calculate } from '../helpers/math';

let n = 0;

class FlyObject {
    constructor(topArg, leftArg) {
        const top = topArg || window.app.top;
        const left = leftArg || window.app.left;
        this.top = top;
        this.left = left;
        this.width = 80;
        this.height = this.width;
        this.background = 'red';
        this.element = this.createElement();
        this.animationEnd = false;
        this.t = 0;
    }

    createElement() {
        const element = document.createElement('div');
        document.body.appendChild(element);
        element.style.position = 'absolute';
        element.style.top = this.top;
        element.style.left = this.left;
        element.style.width = this.width;
        element.style.height = this.height;
        element.style.backgroundColor = this.background;

        return element;
    }

    flyStep(angle, Vo) {
        this.t += 0.1;

        const offset = calculate(this.left, this.top, Vo, angle, this.t);
        this.left = offset.x;
        this.top = offset.y;
        this.element.style.left = this.left;
        this.element.style.top = this.top;

        n++;
        if (n === 20) {
            this.animationEnd = true;
        }
    }

    invokeAnimation(angleArg, VoArg) {
        const angle = angleArg || window.app.angle;
        const Vo = VoArg || window.app.VoArg;

        const animation = setInterval(() => {
            this.flyStep(angle, Vo);
            if (this.animationEnd) {
                clearInterval(animation);
            }
        }, window.app.frameSpeed);
    }
}

export default FlyObject;
