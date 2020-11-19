const collisions = {
    /**
     * Type of collision for simple HTML elements (rectangle divs)
     * @param {HTMLElement} source - source element to find with what elements it could collide
     * @param {HTMLElement} aim - HTML element to find potential collision with
     * @returns {Object} object with status of collision and coordinates
     */
    boxToBox: (source, aim) => {
        const collisionData = {
            collision: false
        };

        if (((source.top <= aim.top && (source.top + source.element.offsetHeight) >= aim.top)
            || (aim.top <= source.top && (aim.top + aim.element.offsetHeight) >= source.top))
            && ((source.left <= aim.left && (source.left + source.element.offsetWidth) >= aim.left)
            || (aim.left <= source.left && (aim.left + aim.element.offsetWidth) >= source.left))) {
            const collisionY = Math.max(source.top, aim.top);
            const height = Math.min(source.top + source.element.offsetHeight, aim.top + aim.element.offsetHeight) - collisionY;
            const collisionX = Math.max(source.left, aim.left);
            const width = Math.min(source.left + source.element.offsetWidth, aim.left + aim.element.offsetWidth) - collisionX;

            collisionData.collision = true;
            collisionData.collisionX = collisionX;
            collisionData.collisionY = collisionY;
            collisionData.width = width;
            collisionData.height = height;
        }

        return collisionData;
    }
};

/**
 * Defines collision coordinates of HTML objects based on type of object (rect, circle e t c)
 * @param {HTMLElement} source - source element to find with what elements it could collide
 * @param {Array<HTMLElement>} aimsArg - array of HTML elements to find potential collision with (ground or obstacles)
 * @returns {Object} object with status of collision and coordinates
 */
export const checkCollision = (source, aimsArg) => {
    let aims = aimsArg;
    if (!Array.isArray(aims)) {
        aims = [aims];
    }

    let collisionData = {
        collision: false
    };

    for (let i = 0, len = aims.length; i < len; i += 1) {
        const aim = aims[i];
        let collisionType;
        switch (source.elementType) {
            case 'box':
            default:
                switch (aim.elementType) {
                    case 'box':
                    default:
                        collisionType = 'boxToBox';
                        break;
                }
                break;
        }

        collisionData = collisions[collisionType](source, aim);
        if (collisionData.collision) {
            break;
        }
    }

    return collisionData;
};
