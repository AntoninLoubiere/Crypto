import { writable, type StartStopNotifier, type Writable } from 'svelte/store';

export function autoResetStore<T>(
    baseValue: T,
    time: number,
    start?: StartStopNotifier<T>
): Writable<T> {
    const store = writable(baseValue, start);
    let timeoutId: number | null = null;
    store.subscribe((val) => {
        if (timeoutId != null) clearTimeout(timeoutId);

        if (val != baseValue) {
            timeoutId = setTimeout(
                (() => {
                    timeoutId = null;
                    store.set(baseValue);
                }) as TimerHandler,
                time
            );
        } else {
            timeoutId = null;
        }
    });
    return store;
}
