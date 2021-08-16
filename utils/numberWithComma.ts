export function numberWithCommas(x) {
    const floatingPoint = x.toString().split('.');

    floatingPoint[0] = floatingPoint[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return floatingPoint.join('.');
}