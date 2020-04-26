export const separateThousands = (target: number): string => target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
