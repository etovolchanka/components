export function separateThousands(target: number): string {
    return target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}
