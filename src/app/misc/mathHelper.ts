export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const shuffleArray = (array: any[]): any[] => {
    const newArray = structuredClone(array);
    return newArray.sort(() => Math.random() - 0.5);
}