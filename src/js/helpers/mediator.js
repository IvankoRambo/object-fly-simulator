const collisions = {
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

            collisionData = {
                collision: true,
                collisionX,
                collisionY,
                width,
                height
            };
        }

        return collisionData;
    }
};

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
