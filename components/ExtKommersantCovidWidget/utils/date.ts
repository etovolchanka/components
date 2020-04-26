const getLocaleDate = (ISOString: string): string => new Date(ISOString).toLocaleDateString();

const getLocaleTime = (ISOString: string): string => {
    const convertOptions: {[index: string]: string} = { hour: '2-digit', minute: '2-digit' };
    return new Date(ISOString).toLocaleTimeString([], convertOptions);
};

export { getLocaleDate, getLocaleTime };
