export function separateThousands(target: number): string {
    const nbsp = '\u00a0';
    const threeDigitsCondition = /\B(?=(\d{3})+(?!\d))/g;
    return target.toString().replace(threeDigitsCondition, nbsp);
}
