export const getRandomInt = (min: number, max: number, multiple: number = 1) => {
    const range = Math.floor((max - min) / multiple) + 1; 
    const randomNumber = Math.floor(Math.random() * range);

    return min + randomNumber * multiple;
}

export const shuffleArray = (array: any[]): any[] => {
    const newArray = structuredClone(array);
    return newArray.sort(() => Math.random() - 0.5);
}

export function hasDuplicates<T>(array: T[]): boolean {
    const uniqueArray = Array.from(new Set(array));
    return uniqueArray.length !== array.length;
}