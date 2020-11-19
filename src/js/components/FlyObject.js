import Element from './Element';
import Circle from './Circle';
import FireVector from './FireVector';

import { getFromStore, setToStore } from '../store';
import { calculate } from '../helpers/math';
import { checkCollision } from '../helpers/mediator';
import { calculateMaxTopPosition, trackElementFly } from '../helpers/utils';

class FlyObject extends Element {
    /**
     * Class that represents an object which will be animated with flying
     * @param {number} topArg - the top coordinate of FlyObject
     * @param {number} leftArg - the left coordinate of FlyObject
     * @constructor
     */
    constructor(topArg, leftArg) {
        super();
        const top = topArg != null ? topArg : window.app.top;
        const left = leftArg != null ? leftArg : window.app.left;
        this.top = top;
        this.left = left;
        this.l = 0;
        this.width = 80;
        this.height = this.width;
        this.background = 'red';
        this.element = this.createElement(true);
        this.animationStatus = 'pending';
        this.outOfBounds = false;
        this.t = 0;
        this.isDownOnPointerCircle = false;
        this.fireVector = null;
        this.isDownOnFlyObject = false;
        this.offsetFlyObjectPending = null;

        this.globalWrapper = document.querySelector(window.app.CONSTS.globalWrapper);
        this.scrollX = 0;
        this.scrollY = 0;

        this.pointerCircleMouseDownEvent = this.pointerCircleMouseDownEvent.bind(this);
        this.pointerCircleMouseUpEvent = this.pointerCircleMouseUpEvent.bind(this);
        this.pointerCircleMouseMoveEvent = this.pointerCircleMouseMoveEvent.bind(this);
        this.flyObjectMouseDownOnPending = this.flyObjectMouseDownOnPending.bind(this);
        this.flyObjectMouseUpOnPending = this.flyObjectMouseUpOnPending.bind(this);

        this.createPointerCircle();
        this.initEvents();
    }

    /**
     * Creates pointer circle in the center of flying object to have drag-n-drop
     * possibility to define angle and initial speed
     * @returns {void}
     */
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

    /**
     * Represents a movement in a timeframe of a fly
     * @param {number} angle - the angle of fly to set (in radians)
     * @param {number} Vo - the initial start speed of fly to set (in m/s)
     * @returns {void}
     */
    flyStep(angle, Vo) {
        this.t += 0.1;
        const formulaArgs = {
            x0: window.app.left,
            y0: window.app.top,
            Vo,
            angle,
            t: this.t
        };

        const previousLeft = this.left;
        const offset = calculate(formulaArgs);
        this.left = offset.x;
        this.top = offset.y;
        this.element.style.left = `${this.left}px`;
        this.element.style.top = `${this.top}px`;

        this.l = Math.abs(this.left - window.app.left);

        this.scrollX = trackElementFly(this.left, previousLeft, this.scrollX, this.globalWrapper);

        const infoBar = getFromStore('infobar');
        if (infoBar) {
            infoBar.setMeasureLength(this.l);
        }

        if (this.left >= window.app.CONSTS.maxLeftLimit || this.left <= window.app.CONSTS.minLeftLimit) {
            this.animationStatus = 'finished';
            this.outOfBounds = true;
        }

        if (this.animationStatus !== 'finished') {
            const ground = getFromStore('ground');
            if (ground) {
                const collisionData = checkCollision(this, ground);
                this.animationStatus = collisionData.collision ? 'finished' : 'inProgress';
            }
        }
    }

    /**
     * First step to start animation of fly (starts frame changes)
     * @param {number} angleArg - the initial angle of fly to set (in radians)
     * @param {number} VoArg - the initial start speed of fly to set (in m/s)
     * @returns {void}
     */
    invokeAnimation(angleArg, VoArg) {
        this.animationStatus = 'inProgress';
        const angle = angleArg != null ? angleArg : window.app.fireDegree;
        const Vo = VoArg != null ? VoArg : window.app.fireSpeed;

        const animation = setInterval(() => {
            this.flyStep(angle, Vo);
            if (this.animationStatus === 'finished') {
                clearInterval(animation);
                if (!this.outOfBounds) {
                    this.refreshAnimationStatus();
                }
            }
        }, window.app.CONSTS.frameSpeed / window.app.frameSpeedCoefficient);
    }

    /**
     * Gives possibility to throw object again (if object is not out of determined X bounds of app)
     * @returns {void}
     */
    refreshAnimationStatus() {
        this.animationStatus = 'pending';
        this.t = 0;
        this.l = 0;
        setToStore('left', this.left);
        setToStore('top', this.top);
        setToStore('fireDegree', null);
        setToStore('fireSpeed', null);

        const infoBar = getFromStore('infobar');
        if (infoBar) {
            infoBar.fillInfoline('degrees');
            infoBar.fillInfoline('speed');
            infoBar.fillInfoline('height');
        }

        this.pointerCircle.getAbsoluteElementPosition();
        this.pointerCircle.defineCircleParams();
    }

    /**
     * Sets element top position when changing coordinates in infoBar
     * @param {number} topArg - the top position of element to set
     * @returns {void}
     */
    setElementTop(topArg) {
        const top = topArg || 0;
        if (this.element) {
            this.element.style.top = `${top}px`;
            this.top = top;

            this.pointerCircle.getAbsoluteElementPosition();
            this.pointerCircle.defineCircleParams();
        }
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
            const deg = calculate({ rad }, 'fromRadToDegrees');
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

            const infoBar = getFromStore('infobar');
            if (infoBar) {
                infoBar.fillInfoline('degrees');
                infoBar.fillInfoline('speed');
            }
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

                const infoBar = getFromStore('infobar');
                if (infoBar) {
                    infoBar.fillInfoline('height');
                }
            }
        }
    }

    /**
     * Initialize events
     * - Control of FireVector by mouse dragging
     * - Control of box top position dragging
     * @returns {void}
     */
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
