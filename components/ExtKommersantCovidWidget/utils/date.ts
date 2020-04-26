function getLocaleDate(ISOString: string): string {
    return new Date(ISOString).toLocaleDateString();
}

function getLocaleTime(ISOString: string): string {
    const convertOptions: {[index: string]: string} = { hour: '2-digit', minute: '2-digit' };
    return new Date(ISOString).toLocaleTimeString([], convertOptions);
}

export { getLocaleDate, getLocaleTime };
