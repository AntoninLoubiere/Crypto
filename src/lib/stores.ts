import {
    readable,
    writable,
    type Readable,
    type StartStopNotifier,
    type Writable,
} from 'svelte/store';

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

export function autoResetStoreWithTimer<T>(
    baseValue: T,
    seconds: number,
    start?: StartStopNotifier<T>
): [val: Writable<T>, time: Readable<number>] {
    const val = writable(baseValue, start);
    const time = writable(0);

    let intervalId: number | null = null;
    val.subscribe((v) => {
        if (intervalId != null) clearInterval(intervalId);

        if (v != baseValue) {
            time.set(seconds);
            intervalId = setInterval(
                (() => {
                    time.update((v) => {
                        if (v - 1 <= 0) {
                            if (intervalId) clearInterval(intervalId);
                            val.set(baseValue);
                            intervalId = null;
                            return 0;
                        }
                        return v - 1;
                    });
                }) as TimerHandler,
                1000
            );
        } else {
            intervalId = null;
            time;
        }
    });
    return [val, time];
}
