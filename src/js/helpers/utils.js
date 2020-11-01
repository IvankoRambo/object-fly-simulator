export const calculateMaxTopPosition = element => {
    const offsetHeight = element ? element.offsetHeight : 0;
    return window.app.CONSTS.maxTopLimit - offsetHeight;
};
