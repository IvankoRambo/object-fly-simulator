import Element from './Element';
import Circle from './Circle';
import FireVector from './FireVector';

import { getFromStore, setToStore } from '../store';
import { calculate } from '../helpers/math';
import { checkCollision } from '../helpers/mediator';
import { calculateMaxTopPosition } from '../helpers/utils';

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
        this.animationStatus = 'pending';
        this.t = 0;
        this.isDownOnPointerCircle = false;
        this.fireVector = null;
        this.isDownOnFlyObject = false;
        this.offsetFlyObjectPending = null;

        this.pointerCircleMouseDownEvent = this.pointerCircleMouseDownEvent.bind(this);
        this.pointerCircleMouseUpEvent = this.pointerCircleMouseUpEvent.bind(this);
        this.pointerCircleMouseMoveEvent = this.pointerCircleMouseMoveEvent.bind(this);
        this.flyObjectMouseDownOnPending = this.flyObjectMouseDownOnPending.bind(this);
        this.flyObjectMouseUpOnPending = this.flyObjectMouseUpOnPending.bind(this);

        this.createPointerCircle();
        this.initEvents();
    }

    createPointerCircle() {
        this.pointerCircle = new Circle();
        this.pointerCircle.width = window.app.CONSTS.pointerCircleDiameter;
        this.pointerCircle.height = window.app.CONSTS.pointerCircleDiameter;
        this.pointerCircle.element = this.pointerCircle.createElement();
        this.pointerCircle.element.style.top = `${this.height / 2 - this.pointerCircle.height / 2}px`;
        this.pointerCircle.element.style.left = `${this.width / 2 - this.pointerCircle.width / 2}px`;
        this.pointerCircle.element.classList.add(window.app.CONSTS.pointerCircleCls);

        const relativeMiddleElement = document.createElement('div');
        relativeMiddleElement.style.position = 'relative';
        relativeMiddleElement.style.width = `${this.width}px`;
        relativeMiddleElement.style.height = `${this.height}px`;
        relativeMiddleElement.appendChild(this.pointerCircle.element);
        this.element.appendChild(relativeMiddleElement);

        this.pointerCircle.getAbsoluteElementPosition();
        this.pointerCircle.defineCircleParams();
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
            this.animationStatus = collisionData.collision ? 'finished' : 'inProgress';
        }
    }

    invokeAnimation(angleArg, VoArg) {
        this.animationStatus = 'inProgress';
        const angle = angleArg != null ? angleArg : window.app.angle;
        const Vo = VoArg != null ? VoArg : window.app.VoArg;

        const animation = setInterval(() => {
            this.flyStep(angle, Vo);
            if (this.animationStatus === 'finished') {
                clearInterval(animation);
            }
        }, window.app.CONSTS.frameSpeed);
    }

    pointerCircleMouseDownEvent(evt) {
        if (this.animationStatus === 'pending') {
            evt.preventDefault();
            this.isDownOnPointerCircle = true;
            this.fireVector = new FireVector();
            this.fireVector.element = this.fireVector.createElement(true);
        }
    }

    pointerCircleMouseUpEvent() {
        if (this.animationStatus === 'pending' && this.isDownOnPointerCircle) {
            this.isDownOnPointerCircle = false;
            this.fireVector.removeElement();
            this.fireVector = null;

            const deg = getFromStore('fireDegree');
            const speed = getFromStore('fireSpeed');
            if (deg != null && speed != null) {
                this.invokeAnimation(calculate({ degrees: deg }, 'fromDegreesToRad'), speed);
            }
        }
    }

    pointerCircleMouseMoveEvent(evt) {
        if (this.animationStatus === 'pending' && this.isDownOnPointerCircle) {
            const dx = evt.pageX - this.pointerCircle.leftCenter;
            const dy = evt.pageY - this.pointerCircle.topCenter;
            const rad = (Math.atan2(dy, dx) - Math.PI) * (-1);
            const deg = calculate({ rad }, 'fromRadToDegress');
            const speed = Math.abs(dx * window.app.CONSTS.speedPerPixel);
            setToStore('fireDegree', deg);
            setToStore('fireSpeed', speed);
            const moveTo = {
                x: evt.pageX,
                y: evt.pageY
            };
            const lineTo = {
                x: this.pointerCircle.leftCenter,
                y: this.pointerCircle.topCenter
            };
            this.fireVector.drawLine(moveTo, lineTo, window.app.CONSTS.pointerCircleDiameter / 2);
        }
    }

    flyObjectMouseDownOnPending(evt) {
        this.isDownOnFlyObject = true;
        this.offsetFlyObjectPending = this.element.offsetTop - evt.clientY;
    }

    flyObjectMouseUpOnPending() {
        this.isDownOnFlyObject = false;
    }

    flyObjectMouseMoveOnPending(evt) {
        if (this.isDownOnFlyObject) {
            const currentTopPosition = evt.clientY + this.offsetFlyObjectPending;
            const maxTopLimit = calculateMaxTopPosition(this.element);

            if (currentTopPosition >= window.app.CONSTS.minTopLimit && currentTopPosition <= maxTopLimit) {
                this.element.style.top = `${currentTopPosition}px`;
                this.top = currentTopPosition;
                setToStore('top', currentTopPosition);

                this.pointerCircle.getAbsoluteElementPosition();
                this.pointerCircle.defineCircleParams();
            }
        }
    }

    initEvents() {
        this.pointerCircle.element.addEventListener('mousedown', this.pointerCircleMouseDownEvent, false);
        document.addEventListener('mouseup', this.pointerCircleMouseUpEvent, false);
        document.addEventListener('mousemove', this.pointerCircleMouseMoveEvent, false);

        this.element.addEventListener('mousedown', evt => {
            evt.preventDefault();
            const target = evt.target;
            if (!target.classList.contains(window.app.CONSTS.pointerCircleCls)) {
                const animationStatus = this.animationStatus;
                switch (animationStatus) {
                    case 'pending':
                        this.flyObjectMouseDownOnPending(evt);
                        break;
                    default:
                        break;
                }
            }
        }, false);

        document.addEventListener('mouseup', () => {
            const animationStatus = this.animationStatus;
            switch (animationStatus) {
                case 'pending':
                    this.flyObjectMouseUpOnPending();
                    break;
                default:
                    break;
            }
        }, false);

        document.addEventListener('mousemove', evt => {
            const animationStatus = this.animationStatus;
            switch (animationStatus) {
                case 'pending':
                    this.flyObjectMouseMoveOnPending(evt);
                    break;
                default:
                    break;
            }
        }, false);
    }
}

export default FlyObject;
