export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const shuffleArray = (array: any[]): any[] => {
    const newArray = structuredClone(array);
    return newArray.sort(() => Math.random() - 0.5);
}

export function hasDuplicates<T>(array: T[]): boolean {
    const uniqueArray = Array.from(new Set(array));
    return uniqueArray.length !== array.length;
}