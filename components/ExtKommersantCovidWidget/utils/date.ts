function toDoubleDigitFormat(value: number): string {
    return `0${value}`.slice(-2);
}

function getDate(ISOString: string): string {
    const date = new Date(ISOString);
    const day = toDoubleDigitFormat(date.getDate());
    const month = toDoubleDigitFormat(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function getTime(ISOString: string): string {
    const date = new Date(ISOString);
    const hours = toDoubleDigitFormat(date.getHours());
    const minutes = toDoubleDigitFormat(date.getMinutes());
    return `${hours}:${minutes}`;
}

export { getDate, getTime };
