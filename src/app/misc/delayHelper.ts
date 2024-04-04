import { getRandomInt } from "./mathHelper";

export function setRandomTimeout(func: () => void, minDelay: number, maxDelay: number) {
    function delayedExecution() {
        const delay = getRandomInt(minDelay, maxDelay)
        return setTimeout(() => {
            func();
            delayedExecution();
        }, delay);
    }

    // Начинаем вызывать функцию с задержкой
    return delayedExecution();
};