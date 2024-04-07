import { Observable, interval, take, map, timer, mergeMap } from "rxjs";
import { getRandomInt } from "./mathHelper";

export const setRandomDelay = (minDelay: number, maxDelay: number) => {
    const time = getRandomInt(minDelay, maxDelay);
    return setDelay(time);
};

export const setDelay = (ms: number) => {
    return interval(ms).pipe(
        take(1)
    );
}

export const randomInterval = (min: number, max: number): Observable<number> => {
    return timer(Math.random() * (max - min)).pipe(
        map(() => Math.random() * (max - min) + min)
    );
}

export const setRandomInterval = (min: number, max: number, callback: () => void): void => {
    randomInterval(min, max).pipe(
        mergeMap(delay => timer(delay).pipe(map(() => delay)))
    ).subscribe(() => {
        callback();
        setRandomInterval(min, max, callback); // рекурсивно запускаем следующий вызов после выполнения текущего
    });
}